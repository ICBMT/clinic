import { useTranslation } from '@/hooks/use-translation';
import { formatCurrency } from '@/utils/currency-utils';
import { type LandingTreatment } from '@/types/landing';
import { Building2, Clock, Flame } from 'lucide-react';
import { pickName } from './utils';

interface TreatmentsGridProps {
    treatments: LandingTreatment[];
}

/**
 * Popular treatments with live pricing pulled from the treatments table.
 */
export function TreatmentsGrid({ treatments }: TreatmentsGridProps) {
    const { t, locale } = useTranslation();

    if (treatments.length === 0) {
        return null;
    }

    return (
        <section id="treatments" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_treatments_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_treatments_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {treatments.map((treatment) => {
                    const clinicName = pickName(locale, treatment.clinic_name_en, treatment.clinic_name_ar);
                    const description = pickName(locale, treatment.description_en, treatment.description_ar);

                    return (
                        <div
                            key={treatment.id}
                            className="flex flex-col rounded-2xl border border-white/25 bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 dark:bg-slate-800"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {pickName(locale, treatment.name_en, treatment.name_ar)}
                                </h3>
                                {treatment.has_discount && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                                        <Flame className="h-3.5 w-3.5" />
                                        {t('landing_treatments_offer')}
                                    </span>
                                )}
                            </div>

                            {clinicName && (
                                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {clinicName}
                                </p>
                            )}

                            {description && (
                                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {description}
                                </p>
                            )}

                            <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {t('landing_treatments_from')}
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            {formatCurrency(treatment.final_price, treatment.currency)}
                                        </span>
                                        {treatment.has_discount && treatment.base_price > treatment.final_price && (
                                            <span className="text-sm font-medium text-slate-400 line-through">
                                                {formatCurrency(treatment.base_price, treatment.currency)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {treatment.duration_minutes != null && treatment.duration_minutes > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        <Clock className="h-3.5 w-3.5" />
                                        {t('landing_treatments_minutes', { minutes: treatment.duration_minutes })}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
