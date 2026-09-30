/**
 * Types for the dynamic welcome/landing page payload
 * (assembled by App\Services\LandingService).
 */

export interface LandingStats {
    clinics: number;
    treatments: number;
    machines: number;
    bookings: number;
    reviews: number;
    average_rating: number;
}

export interface LandingCategory {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string | null;
    description_ar: string | null;
    treatments_count: number;
}

export interface LandingClinic {
    id: number;
    name_en: string;
    name_ar: string;
    bio_en: string | null;
    bio_ar: string | null;
    logo: string | null;
    average_rating: number;
    total_reviews: number;
    is_featured: boolean;
    area_en: string | null;
    area_ar: string | null;
    governorate_en: string | null;
    governorate_ar: string | null;
    treatments_count: number;
}

export interface LandingTreatment {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string | null;
    description_ar: string | null;
    base_price: number;
    final_price: number;
    has_discount: boolean;
    currency: string;
    duration_minutes: number | null;
    is_featured: boolean;
    clinic_name_en: string | null;
    clinic_name_ar: string | null;
}

export interface LandingMachine {
    id: number;
    model_en: string;
    model_ar: string;
    manufacturer_en: string | null;
    manufacturer_ar: string | null;
    description_en: string | null;
    description_ar: string | null;
    image: string | null;
    status: string;
    clinic_name_en: string | null;
    clinic_name_ar: string | null;
}

export interface LandingReview {
    id: number;
    rating: number;
    comment: string;
    user_name: string | null;
    clinic_name_en: string | null;
    clinic_name_ar: string | null;
    created_at: string | null;
}

export interface LandingFaq {
    id: number;
    question_en: string;
    question_ar: string;
    answer_en: string;
    answer_ar: string;
    category: string | null;
}

export interface LandingBanner {
    id: number;
    title_en: string | null;
    title_ar: string | null;
    description_en: string | null;
    description_ar: string | null;
    image_url: string | null;
    link_url: string | null;
}

export interface LandingData {
    stats: LandingStats;
    categories: LandingCategory[];
    featured_clinics: LandingClinic[];
    treatments: LandingTreatment[];
    machines: LandingMachine[];
    reviews: LandingReview[];
    faqs: LandingFaq[];
    banner: LandingBanner | null;
}

export const emptyLanding: LandingData = {
    stats: {
        clinics: 0,
        treatments: 0,
        machines: 0,
        bookings: 0,
        reviews: 0,
        average_rating: 0,
    },
    categories: [],
    featured_clinics: [],
    treatments: [],
    machines: [],
    reviews: [],
    faqs: [],
    banner: null,
};
