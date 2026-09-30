import { useTranslation } from '@/hooks/use-translation';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

interface LandingFooterProps {
    appName: string;
}

/**
 * Rich marketing footer with brand, quick links and live contact details
 * from the site settings.
 */
export function LandingFooter({ appName }: LandingFooterProps) {
    const { t, locale, isRTL } = useTranslation();
    const { siteSettings } = usePage<SharedData>().props;

    const contactEmail = siteSettings?.contact_email || siteSettings?.support_email;
    const contactPhone = siteSettings?.contact_phone || siteSettings?.support_phone;
    const contactAddress =
        (isRTL
            ? siteSettings?.contact_address_ar || siteSettings?.support_address_ar
            : siteSettings?.contact_address_en || siteSettings?.support_address_en) || '';

    return (
        <footer className="border-t border-white/20 bg-[#2B1257]/60 backdrop-blur-sm">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {/* Brand */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient">
                            <span className="text-sm font-bold text-white">{appName.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-lg font-bold text-white">{appName}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{t('landing_footer_about_text')}</p>
                </div>

                {/* Quick links */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
                        {t('landing_footer_links_title')}
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        <li>
                            <a href="#categories" className="text-white/70 transition-colors hover:text-white">
                                {t('landing_nav_categories')}
                            </a>
                        </li>
                        <li>
                            <a href="#clinics" className="text-white/70 transition-colors hover:text-white">
                                {t('landing_nav_clinics')}
                            </a>
                        </li>
                        <li>
                            <a href="#treatments" className="text-white/70 transition-colors hover:text-white">
                                {t('landing_nav_treatments')}
                            </a>
                        </li>
                        <li>
                            <Link href="/privacy" className="text-white/70 transition-colors hover:text-white">
                                {t('privacy_policy')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="text-white/70 transition-colors hover:text-white">
                                {t('terms_conditions')}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* For clinics */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
                        {t('landing_footer_clinics_title')}
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        <li>
                            <Link href="/register" className="text-white/70 transition-colors hover:text-white">
                                {t('landing_cta_register_clinic')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="text-white/70 transition-colors hover:text-white">
                                {t('login')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-white/70 transition-colors hover:text-white">
                                {t('contact_us')}
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
                        {t('landing_footer_contact_title')}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-white/70">
                        {contactEmail && (
                            <li className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                                <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-white">
                                    {contactEmail}
                                </a>
                            </li>
                        )}
                        {contactPhone && (
                            <li className="flex items-center gap-2.5" dir="ltr">
                                <Phone className="h-4 w-4 shrink-0 text-white/50" />
                                <a href={`tel:${contactPhone}`} className="transition-colors hover:text-white">
                                    {contactPhone}
                                </a>
                            </li>
                        )}
                        {contactAddress && (
                            <li className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                                <span>{contactAddress}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
                    <p>
                        © {new Date().getFullYear()} {appName}. {t('all_rights_reserved')}
                    </p>
                    <p>{locale === 'ar' ? 'صنع بفخر في الكويت 🇰🇼' : 'Proudly made in Kuwait 🇰🇼'}</p>
                </div>
            </div>
        </footer>
    );
}
