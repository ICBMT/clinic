<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Clinic;
use App\Models\Faq;
use App\Models\Treatment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_renders_with_landing_payload(): void
    {
        $this->get('/')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->has('landing.stats')
                ->has('landing.categories')
                ->has('landing.featured_clinics')
                ->has('landing.treatments')
                ->has('landing.machines')
                ->has('landing.reviews')
                ->has('landing.faqs')
        );
    }

    public function test_welcome_page_exposes_live_database_content(): void
    {
        $owner = User::factory()->create();

        $category = Category::create([
            'name_en' => 'Laser Treatment',
            'name_ar' => 'علاج بالليزر',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $clinic = Clinic::create([
            'owner_id' => $owner->id,
            'name_en' => 'Demo Dermatology Clinic',
            'name_ar' => 'عيادة الجلدية التجريبية',
            'status' => 'approved',
            'approved_at' => now(),
            'is_featured' => true,
            'average_rating' => 4.8,
            'total_reviews' => 12,
        ]);

        Treatment::create([
            'clinic_id' => $clinic->id,
            'category_id' => $category->id,
            'name_en' => 'Demo Laser Session',
            'name_ar' => 'جلسة ليزر تجريبية',
            'base_price' => 50,
            'final_price' => 40,
            'has_discount' => true,
            'currency' => 'KWD',
            'status' => 'approved',
            'is_featured' => true,
        ]);

        Faq::create([
            'question_en' => 'Is this a demo FAQ?',
            'question_ar' => 'هل هذا سؤال تجريبي؟',
            'answer_en' => 'Yes, it is.',
            'answer_ar' => 'نعم.',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->get('/')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->where('landing.categories.0.name_en', 'Laser Treatment')
                ->where('landing.categories.0.treatments_count', 1)
                ->where('landing.featured_clinics.0.name_en', 'Demo Dermatology Clinic')
                ->where('landing.featured_clinics.0.average_rating', 4.8)
                ->where('landing.treatments.0.name_en', 'Demo Laser Session')
                ->where('landing.treatments.0.final_price', 40)
                ->where('landing.treatments.0.has_discount', true)
                ->where('landing.faqs.0.question_en', 'Is this a demo FAQ?')
        );
    }

    public function test_welcome_page_supports_arabic_locale_and_rtl(): void
    {
        $this->get('/?lang=ar')->assertOk()->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->where('locale', 'ar')
                ->where('rtl', true)
        );
    }
}
