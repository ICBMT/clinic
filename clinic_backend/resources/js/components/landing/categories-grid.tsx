import { useTranslation } from '@/hooks/use-translation';
import { type LandingCategory } from '@/types/landing';
import { categoryIcon, pickName } from './utils';

interface CategoriesGridProps {
    categories: LandingCategory[];
}

/**
 * Treatment specialties, pulled live from the categories table.
 */
export function CategoriesGrid({ categories }: CategoriesGridProps) {
    const { t, locale } = useTranslation();

    if (categories.length === 0) {
        return null;
    }

    return (
        <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_categories_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_categories_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category, index) => {
                    const Icon = categoryIcon(index);
                    const description = pickName(locale, category.description_en, category.description_ar);

                    return (
                        <div
                            key={category.id}
                            className="group rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-md dark:bg-slate-800">
                                <Icon className="h-6 w-6 text-[#6B46C1] dark:text-violet-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                {pickName(locale, category.name_en, category.name_ar)}
                            </h3>
                            {description && (
                                <p className="mt-1.5 line-clamp-2 text-sm text-white/70">{description}</p>
                            )}
                            <p className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                {t('landing_categories_treatments', { count: category.treatments_count })}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
