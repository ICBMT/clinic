import { useTranslation } from '@/hooks/use-translation';
import { type LandingBanner, type LandingStats } from '@/types/landing';
import { Star, CalendarCheck } from 'lucide-react';
import heroImage from '../../../img/landing-hero.jpg';

interface HeroProps {
    stats: LandingStats;
    banner: LandingBanner | null;
}

/**
 * Hero section: headline, dynamic banner copy (if configured in the
 * dashboard), CTAs and the hero visual with live stat chips.
 */
export function Hero({ stats, banner }: HeroProps) {
    const { t, locale } = useTranslation();
    const isAr = locale === 'ar';

    const title = banner ? (isAr ? banner.title_ar : banner.title_en) || null : null;
    const subtitle = banner ? (isAr ? banner.description_ar : banner.description_en) || null : null;

    return (
        <section className="relative overflow-hidden">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-32 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-20">
                {/* Copy */}
                <div className="text-center lg:text-start">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        <span className="text-sm font-medium text-white">{t('landing_badge')}</span>
                    </div>

                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl">
                        {title ?? (
                            <>
                                {t('landing_hero_title_1')}
                                <span className="block bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                                    {t('landing_hero_title_2')}
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85 lg:mx-0">
                        {subtitle ?? t('landing_hero_subtitle')}
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <a
                            href="#clinics"
                            className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#5B3BA8] shadow-lg transition-transform hover:scale-[1.03]"
                        >
                            {t('landing_cta_explore_clinics')}
                        </a>
                        <a
                            href="#treatments"
                            className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                            {t('landing_cta_explore_treatments')}
                        </a>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                            {t('landing_app_badge')}
                        </span>
                    </div>
                </div>

                {/* Visual */}
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                    <div className="overflow-hidden rounded-3xl border border-white/30 shadow-2xl">
                        <img
                            src={heroImage}
                            alt={t('landing_hero_image_alt')}
                            className="aspect-[4/3] w-full object-cover"
                            loading="eager"
                        />
                    </div>

                    {/* Floating rating card */}
                    {stats.average_rating > 0 && (
                        <div className="absolute -bottom-6 -start-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-800 sm:-start-8">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    {stats.average_rating.toFixed(1)}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {t('landing_hero_card_rating')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floating bookings card */}
                    {stats.bookings > 0 && (
                        <div className="absolute -end-4 -top-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-800 sm:-end-8">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20">
                                <CalendarCheck className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    {stats.bookings.toLocaleString('en-US')}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {t('landing_hero_card_bookings')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
