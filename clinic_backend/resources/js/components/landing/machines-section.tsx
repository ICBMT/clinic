import { useTranslation } from '@/hooks/use-translation';
import { type LandingMachine } from '@/types/landing';
import { Cpu } from 'lucide-react';
import { initials, pickName } from './utils';

interface MachinesSectionProps {
    machines: LandingMachine[];
}

const statusStyles: Record<string, string> = {
    ready: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    busy: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

const statusKeys: Record<string, string> = {
    ready: 'landing_machines_ready',
    maintenance: 'landing_machines_maintenance',
    busy: 'landing_machines_busy',
};

/**
 * Medical technology catalogue, pulled live from the machines table.
 */
export function MachinesSection({ machines }: MachinesSectionProps) {
    const { t, locale } = useTranslation();

    if (machines.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_machines_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_machines_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {machines.map((machine) => {
                    const manufacturer = pickName(locale, machine.manufacturer_en, machine.manufacturer_ar);
                    const description = pickName(locale, machine.description_en, machine.description_ar);
                    const clinicName = pickName(locale, machine.clinic_name_en, machine.clinic_name_ar);
                    const model = pickName(locale, machine.model_en, machine.model_ar);

                    return (
                        <div
                            key={machine.id}
                            className="overflow-hidden rounded-2xl border border-white/25 bg-white shadow-xl transition-transform hover:-translate-y-1 dark:bg-slate-800"
                        >
                            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                                {machine.image ? (
                                    <img
                                        src={machine.image}
                                        alt={model}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Cpu className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                                    </div>
                                )}
                                <span
                                    className={`absolute top-3 end-3 rounded-full px-2.5 py-1 text-xs font-bold shadow ${statusStyles[machine.status] ?? 'bg-slate-100 text-slate-600'}`}
                                >
                                    {t(statusKeys[machine.status] ?? 'landing_machines_ready')}
                                </span>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{model}</h3>
                                {manufacturer && (
                                    <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {manufacturer}
                                    </p>
                                )}
                                {description && (
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                                        {description}
                                    </p>
                                )}
                                {clinicName && (
                                    <p className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                                        <span className="truncate">{clinicName}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
