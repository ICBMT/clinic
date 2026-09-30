import { CtaSection } from '@/components/landing/cta-section';
import { CategoriesGrid } from '@/components/landing/categories-grid';
import { FaqSection } from '@/components/landing/faq-section';
import { FeaturedClinics } from '@/components/landing/featured-clinics';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHeader } from '@/components/landing/landing-header';
import { MachinesSection } from '@/components/landing/machines-section';
import { ReviewsSection } from '@/components/landing/reviews-section';
import { StatsBar } from '@/components/landing/stats-bar';
import { TreatmentsGrid } from '@/components/landing/treatments-grid';
import { useRTLInit } from '@/hooks/use-rtl-init';
import { useTranslation } from '@/hooks/use-translation';
import FrontendLayout from '@/layouts/frontend-layout';
import { type SharedData } from '@/types';
import { emptyLanding, type LandingData } from '@/types/landing';
import { usePage } from '@inertiajs/react';

interface WelcomeProps {
    landing?: LandingData;
}

/**
 * Public welcome/landing page.
 *
 * Fully dynamic: every section (stats, categories, clinics, treatments,
 * machines, reviews, FAQs, hero banner) is assembled by
 * App\Services\LandingService from live database content. Sections render
 * nothing when they have no data, so the page degrades gracefully on a
 * fresh installation.
 */
export default function Welcome() {
    useRTLInit();
    const { t, locale, isRTL } = useTranslation();
    const { siteSettings } = usePage<SharedData>().props;
    const page = usePage<SharedData & WelcomeProps>();

    const landing: LandingData = { ...emptyLanding, ...(page.props.landing ?? {}) };

    const appNameEn = siteSettings?.app_name_en || t('app_name');
    const appNameAr = siteSettings?.app_name_ar || t('app_name');
    const appName = isRTL ? appNameAr : appNameEn;

    return (
        <FrontendLayout title={t('landing_page_title')} showHeader={false} showFooter={false}>
            <div className="flex min-h-screen flex-col" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <LandingHeader appName={appName} />

                <main className="flex-1">
                    <Hero stats={landing.stats} banner={landing.banner} />
                    <StatsBar stats={landing.stats} />
                    <CategoriesGrid categories={landing.categories} />
                    <FeaturedClinics clinics={landing.featured_clinics} />
                    <HowItWorks />
                    <TreatmentsGrid treatments={landing.treatments} />
                    <MachinesSection machines={landing.machines} />
                    <ReviewsSection reviews={landing.reviews} />
                    <FaqSection faqs={landing.faqs} />
                    <CtaSection />
                </main>

                <LandingFooter appName={appName} />
            </div>
        </FrontendLayout>
    );
}
