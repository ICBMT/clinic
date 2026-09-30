import { useTranslation } from '@/hooks/use-translation';
import { type LandingStats } from '@/types/landing';
import { Building2, CalendarCheck, MessageSquareHeart, Sparkles, Star, Wand2 } from 'lucide-react';

interface StatsBarProps {
    stats: LandingStats;
}

/**
 * Live platform statistics, rendered only for metrics that have data.
 */
export function StatsBar({ stats }: StatsBarProps) {
    const { t } = useTranslation();

    const items = [
        { icon: Building2, value: stats.clinics, label: t('landing_stats_clinics') },
        { icon: Sparkles, value: stats.treatments, label: t('landing_stats_treatments') },
        { icon: Wand2, value: stats.machines, label: t('landing_stats_machines') },
        { icon: CalendarCheck, value: stats.bookings, label: t('landing_stats_bookings') },
        { icon: MessageSquareHeart, value: stats.reviews, label: t('landing_stats_reviews') },
    ].filter((item) => item.value > 0);

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:grid-cols-3 lg:grid-cols-5 dark:border-slate-700/40 dark:bg-slate-800/80">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-gradient">
                            <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                                {item.value.toLocaleString('en-US')}
                            </div>
                            <div className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                {item.label}
                            </div>
                        </div>
                    </div>
                ))}
                {stats.average_rating > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                            <Star className="h-5 w-5 fill-white text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                                {stats.average_rating.toFixed(1)}
                            </div>
                            <div className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                {t('landing_stats_rating')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
