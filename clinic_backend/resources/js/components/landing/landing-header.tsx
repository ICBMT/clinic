import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LandingHeaderProps {
    appName: string;
}

/**
 * Sticky, translucent marketing header for the welcome page.
 */
export function LandingHeader({ appName }: LandingHeaderProps) {
    const { t } = useTranslation();
    const { auth, siteSettings, rtl } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const appLogo = siteSettings?.app_logo;
    const appInitial = appName.charAt(0).toUpperCase();

    const navItems = [
        { href: '#categories', label: t('landing_nav_categories') },
        { href: '#clinics', label: t('landing_nav_clinics') },
        { href: '#treatments', label: t('landing_nav_treatments') },
        { href: '#how-it-works', label: t('landing_nav_how_it_works') },
        { href: '#faq', label: t('landing_nav_faq') },
    ];

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5">
                    {appLogo ? (
                        <img src={appLogo} alt={appName} className="h-9 w-9 rounded-lg object-contain" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient">
                            <span className="text-sm font-bold text-white">{appInitial}</span>
                        </div>
                    )}
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{appName}</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    {auth?.user ? (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href="/dashboard"
                                className="rounded-full bg-primary-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                            >
                                {t('dashboard')}
                            </Link>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    router.post('/logout', {}, { onSuccess: () => window.location.reload() });
                                }}
                                className="text-slate-600 dark:text-slate-300"
                                title={t('logout')}
                            >
                                <LogOut className={cn('h-4 w-4', rtl ? 'ml-1.5' : 'mr-1.5')} />
                                {t('logout')}
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href="/login"
                                className="rounded-full px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white/60 dark:text-slate-200 dark:hover:bg-slate-800/60"
                            >
                                {t('login')}
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-primary-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                            >
                                {t('register')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white/60 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800/60"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={t('landing_nav_menu')}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="border-t border-white/20 bg-white/90 px-4 pb-4 pt-2 lg:hidden dark:border-slate-700/40 dark:bg-slate-900/90">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={closeMobile}
                                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-800/60"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="mt-2 flex gap-2 border-t border-white/20 pt-3 dark:border-slate-700/40">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={closeMobile}
                                    className="flex-1 rounded-full bg-primary-gradient px-5 py-2 text-center text-sm font-semibold text-white"
                                >
                                    {t('dashboard')}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMobile}
                                        className="flex-1 rounded-full border border-slate-300 px-5 py-2 text-center text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={closeMobile}
                                        className="flex-1 rounded-full bg-primary-gradient px-5 py-2 text-center text-sm font-semibold text-white"
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
