import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { type LandingClinic } from '@/types/landing';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import { initials, pickName } from './utils';

interface FeaturedClinicsProps {
    clinics: LandingClinic[];
}

/**
 * Featured approved clinics, pulled live from the clinics table.
 */
export function FeaturedClinics({ clinics }: FeaturedClinicsProps) {
    const { t, locale } = useTranslation();

    if (clinics.length === 0) {
        return (
            <section id="clinics" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-white/25 bg-white/10 p-10 text-center backdrop-blur-sm">
                    <h2 className="text-2xl font-extrabold text-white">{t('landing_clinics_title')}</h2>
                    <p className="mt-2 text-white/75">{t('landing_clinics_empty')}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="clinics" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_clinics_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_clinics_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {clinics.map((clinic) => {
                    const location = pickName(locale, clinic.area_en, clinic.area_ar);
                    const governorate = pickName(locale, clinic.governorate_en, clinic.governorate_ar);

                    return (
                        <div
                            key={clinic.id}
                            className="group overflow-hidden rounded-2xl border border-white/25 bg-white shadow-xl transition-transform hover:-translate-y-1 dark:bg-slate-800"
                        >
                            {/* Cover image / logo */}
                            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-violet-200 to-violet-400 dark:from-slate-700 dark:to-slate-600">
                                {clinic.logo ? (
                                    <img
                                        src={clinic.logo}
                                        alt={pickName(locale, clinic.name_en, clinic.name_ar)}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <span className="text-5xl font-extrabold text-white/70">
                                            {initials(pickName(locale, clinic.name_en, clinic.name_ar))}
                                        </span>
                                    </div>
                                )}
                                {clinic.is_featured && (
                                    <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        {t('landing_clinics_featured')}
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {pickName(locale, clinic.name_en, clinic.name_ar)}
                                    </h3>
                                    {clinic.average_rating > 0 && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            {clinic.average_rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {(location || governorate) && (
                                    <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {[location, governorate].filter(Boolean).join(locale === 'ar' ? '، ' : ', ')}
                                    </p>
                                )}

                                {pickName(locale, clinic.bio_en, clinic.bio_ar) && (
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                                        {pickName(locale, clinic.bio_en, clinic.bio_ar)}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                    <span>{t('landing_clinics_treatments', { count: clinic.treatments_count })}</span>
                                    <span
                                        className={cn(
                                            clinic.total_reviews > 0 && 'text-slate-600 dark:text-slate-300',
                                        )}
                                    >
                                        {t('landing_clinics_reviews', { count: clinic.total_reviews })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
