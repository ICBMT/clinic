import { useTranslation } from '@/hooks/use-translation';
import { CalendarHeart, CreditCard, Search, Sparkles } from 'lucide-react';

/**
 * Static four-step booking flow explaining the platform workflow.
 */
export function HowItWorks() {
    const { t } = useTranslation();

    const steps = [
        { icon: Search, title: t('landing_how_step1_title'), description: t('landing_how_step1_desc') },
        { icon: CalendarHeart, title: t('landing_how_step2_title'), description: t('landing_how_step2_desc') },
        { icon: CreditCard, title: t('landing_how_step3_title'), description: t('landing_how_step3_desc') },
        { icon: Sparkles, title: t('landing_how_step4_title'), description: t('landing_how_step4_desc') },
    ];

    return (
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_how_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_how_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <div key={step.title} className="relative rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm">
                        <div className="absolute -top-4 start-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[#5B3BA8] shadow-lg dark:bg-slate-800 dark:text-violet-300">
                            {index + 1}
                        </div>
                        <div className="mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient">
                            <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/75">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
