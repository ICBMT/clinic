import { useTranslation } from '@/hooks/use-translation';
import { Building2, PhoneCall, Smartphone } from 'lucide-react';

/**
 * Closing call-to-action: register a clinic or get in touch, with a
 * mobile-app teaser.
 */
export function CtaSection() {
    const { t } = useTranslation();

    return (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/15 p-10 text-center backdrop-blur-md sm:p-14">
                <div className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

                <Smartphone className="mx-auto mb-5 h-10 w-10 text-white/90" />
                <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                    {t('landing_cta_title')}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85">
                    {t('landing_cta_subtitle')}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#5B3BA8] shadow-lg transition-transform hover:scale-[1.03]"
                    >
                        <Building2 className="h-4 w-4" />
                        {t('landing_cta_register_clinic')}
                    </a>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
                    >
                        <PhoneCall className="h-4 w-4" />
                        {t('landing_cta_contact')}
                    </a>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/70">
                    {t('landing_app_badge')}
                </p>
            </div>
        </section>
    );
}
