import { useTranslation } from '@/hooks/use-translation';
import { type LandingFaq } from '@/types/landing';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { pickName } from './utils';

interface FaqSectionProps {
    faqs: LandingFaq[];
}

/**
 * FAQ accordion, driven by the active rows in the faqs table.
 */
export function FaqSection({ faqs }: FaqSectionProps) {
    const { t, locale } = useTranslation();
    const [openId, setOpenId] = useState<number | null>(faqs.length > 0 ? faqs[0].id : null);

    if (faqs.length === 0) {
        return null;
    }

    return (
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_faq_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_faq_subtitle')}</p>
            </div>

            <div className="space-y-3">
                {faqs.map((faq) => {
                    const isOpen = openId === faq.id;

                    return (
                        <div
                            key={faq.id}
                            className="overflow-hidden rounded-2xl border border-white/25 bg-white/90 backdrop-blur-sm dark:bg-slate-800/90"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenId(isOpen ? null : faq.id)}
                                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-start"
                                aria-expanded={isOpen}
                            >
                                <span className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                    {pickName(locale, faq.question_en, faq.question_ar)}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                                        isOpen && 'rotate-180 text-[#6B46C1] dark:text-violet-300',
                                    )}
                                />
                            </button>
                            {isOpen && (
                                <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-700">
                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                        {pickName(locale, faq.answer_en, faq.answer_ar)}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
