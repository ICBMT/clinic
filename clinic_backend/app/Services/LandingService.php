<?php

namespace App\Services;

use App\Models\Banner;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Clinic;
use App\Models\Faq;
use App\Models\Machine;
use App\Models\Review;
use App\Models\Treatment;
use Illuminate\Support\Facades\Log;

/**
 * Assembles all dynamic content shown on the public welcome/landing page.
 *
 * Every section is assembled defensively: if the database (or a table) is
 * unavailable the section degrades to an empty payload instead of taking
 * the page down, so the marketing page keeps rendering in any environment.
 */
class LandingService
{
    /**
     * Build the full landing payload for the welcome page.
     */
    public function build(): array
    {
        return [
            'stats' => $this->stats(),
            'categories' => $this->categories(),
            'featured_clinics' => $this->featuredClinics(),
            'treatments' => $this->treatments(),
            'machines' => $this->machines(),
            'reviews' => $this->reviews(),
            'faqs' => $this->faqs(),
            'banner' => $this->heroBanner(),
        ];
    }

    /**
     * Platform-wide statistics for the hero/stats sections.
     */
    public function stats(): array
    {
        return $this->guard('stats', [
            'clinics' => 0,
            'treatments' => 0,
            'machines' => 0,
            'bookings' => 0,
            'reviews' => 0,
            'average_rating' => 0,
        ], function () {
            $approvedClinics = Clinic::where('status', 'approved');

            return [
                'clinics' => (clone $approvedClinics)->count(),
                'treatments' => Treatment::where('status', 'approved')->count(),
                'machines' => Machine::count(),
                'bookings' => Booking::count(),
                'reviews' => Review::where('status', 'approved')->count(),
                'average_rating' => round((float) (clone $approvedClinics)
                    ->where('average_rating', '>', 0)
                    ->avg('average_rating'), 1),
            ];
        });
    }

    /**
     * Active treatment categories with live treatment counts.
     */
    public function categories(): array
    {
        return $this->guard('categories', [], function () {
            return Category::where('status', 'active')
                ->orderBy('sort_order')
                ->orderBy('name_en')
                ->get()
                ->map(function (Category $category) {
                    return [
                        'id' => $category->id,
                        'name_en' => $category->name_en,
                        'name_ar' => $category->name_ar,
                        'description_en' => $category->description_en,
                        'description_ar' => $category->description_ar,
                        'treatments_count' => Treatment::where('category_id', $category->id)
                            ->where('status', 'approved')
                            ->count(),
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Featured (fallback: latest) approved clinics.
     */
    public function featuredClinics(int $limit = 6): array
    {
        return $this->guard('featured_clinics', [], function () use ($limit) {
            return Clinic::where('status', 'approved')
                ->with(['area', 'governorate'])
                ->orderByDesc('is_featured')
                ->orderByDesc('average_rating')
                ->limit($limit)
                ->get()
                ->map(function (Clinic $clinic) {
                    return [
                        'id' => $clinic->id,
                        'name_en' => $clinic->name_en,
                        'name_ar' => $clinic->name_ar,
                        'bio_en' => $clinic->bio_en,
                        'bio_ar' => $clinic->bio_ar,
                        'logo' => $clinic->logo,
                        'average_rating' => round((float) $clinic->average_rating, 1),
                        'total_reviews' => (int) $clinic->total_reviews,
                        'is_featured' => (bool) $clinic->is_featured,
                        'area_en' => $clinic->area?->name_en,
                        'area_ar' => $clinic->area?->name_ar,
                        'governorate_en' => $clinic->governorate?->name_en,
                        'governorate_ar' => $clinic->governorate?->name_ar,
                        'treatments_count' => Treatment::where('clinic_id', $clinic->id)
                            ->where('status', 'approved')
                            ->count(),
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Featured (fallback: latest) approved treatments with pricing.
     */
    public function treatments(int $limit = 6): array
    {
        return $this->guard('treatments', [], function () use ($limit) {
            return Treatment::where('status', 'approved')
                ->with('clinic')
                ->orderByDesc('is_featured')
                ->orderByDesc('id')
                ->limit($limit)
                ->get()
                ->map(function (Treatment $treatment) {
                    $basePrice = (float) ($treatment->base_price ?? 0);
                    $finalPrice = (float) ($treatment->final_price ?? $basePrice);

                    return [
                        'id' => $treatment->id,
                        'name_en' => $treatment->name_en,
                        'name_ar' => $treatment->name_ar,
                        'description_en' => $treatment->description_en,
                        'description_ar' => $treatment->description_ar,
                        'base_price' => $basePrice,
                        'final_price' => $finalPrice,
                        'has_discount' => (bool) $treatment->has_discount && $finalPrice < $basePrice,
                        'currency' => $treatment->currency ?? 'KWD',
                        'duration_minutes' => $treatment->service_duration_minutes,
                        'is_featured' => (bool) $treatment->is_featured,
                        'clinic_name_en' => $treatment->clinic?->name_en,
                        'clinic_name_ar' => $treatment->clinic?->name_ar,
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Medical machines available on the platform.
     */
    public function machines(int $limit = 6): array
    {
        return $this->guard('machines', [], function () use ($limit) {
            return Machine::query()
                ->with('clinic')
                ->where(function ($query) {
                    // Platform-owned machines have no request workflow;
                    // clinic-requested ones must be approved.
                    $query->whereNull('request_status')
                        ->orWhere('request_status', 'approved');
                })
                ->orderByDesc('id')
                ->limit($limit)
                ->get()
                ->map(function (Machine $machine) {
                    return [
                        'id' => $machine->id,
                        'model_en' => $machine->model_en,
                        'model_ar' => $machine->model_ar,
                        'manufacturer_en' => $machine->manufacturer_en,
                        'manufacturer_ar' => $machine->manufacturer_ar,
                        'description_en' => $machine->description_en,
                        'description_ar' => $machine->description_ar,
                        'image' => $machine->image,
                        'status' => $machine->status,
                        'clinic_name_en' => $machine->clinic?->name_en,
                        'clinic_name_ar' => $machine->clinic?->name_ar,
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Latest approved patient reviews (social proof section).
     */
    public function reviews(int $limit = 6): array
    {
        return $this->guard('reviews', [], function () use ($limit) {
            return Review::where('status', 'approved')
                ->whereNotNull('comment')
                ->with(['user', 'clinic'])
                ->orderByDesc('id')
                ->limit($limit)
                ->get()
                ->map(function (Review $review) {
                    return [
                        'id' => $review->id,
                        'rating' => (int) $review->rating,
                        'comment' => $review->comment,
                        'user_name' => $review->user?->name,
                        'clinic_name_en' => $review->clinic?->name_en,
                        'clinic_name_ar' => $review->clinic?->name_ar,
                        'created_at' => optional($review->created_at)->toDateString(),
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Frequently asked questions for the public accordion.
     */
    public function faqs(int $limit = 8): array
    {
        return $this->guard('faqs', [], function () use ($limit) {
            return Faq::where('is_active', true)
                ->orderBy('sort_order')
                ->limit($limit)
                ->get()
                ->map(function (Faq $faq) {
                    return [
                        'id' => $faq->id,
                        'question_en' => $faq->question_en,
                        'question_ar' => $faq->question_ar,
                        'answer_en' => $faq->answer_en,
                        'answer_ar' => $faq->answer_ar,
                        'category' => $faq->category,
                    ];
                })
                ->values()
                ->all();
        });
    }

    /**
     * Active homepage hero banner, if one is configured.
     */
    public function heroBanner(): ?array
    {
        return $this->guard('banner', null, function () {
            $banner = Banner::where('status', 'active')
                ->where('type', 'homepage')
                ->where(function ($query) {
                    $query->whereNull('start_date')->orWhere('start_date', '<=', now());
                })
                ->where(function ($query) {
                    $query->whereNull('end_date')->orWhere('end_date', '>=', now());
                })
                ->orderBy('sort_order')
                ->first();

            if (! $banner) {
                return null;
            }

            return [
                'id' => $banner->id,
                'title_en' => $banner->title_en,
                'title_ar' => $banner->title_ar,
                'description_en' => $banner->description_en,
                'description_ar' => $banner->description_ar,
                'image_url' => $banner->image_url,
                'link_url' => $banner->link_url,
            ];
        });
    }

    /**
     * Run a payload section, degrading to $fallback when anything fails
     * (missing table, empty database, ...).
     *
     * @template T
     *
     * @param  string  $section  section name used for logging
     * @param  T  $fallback
     * @param  callable(): T  $callback
     * @return T
     */
    private function guard(string $section, mixed $fallback, callable $callback): mixed
    {
        try {
            return $callback();
        } catch (\Throwable $e) {
            Log::warning("LandingService: failed to build '{$section}' section", [
                'error' => $e->getMessage(),
            ]);

            return $fallback;
        }
    }
}
