import { useTranslation } from '@/hooks/use-translation';
import { type LandingReview } from '@/types/landing';
import { Quote, Star } from 'lucide-react';
import { initials, pickName } from './utils';

interface ReviewsSectionProps {
    reviews: LandingReview[];
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'
                    }`}
                />
            ))}
        </div>
    );
}

/**
 * Verified patient reviews, pulled live from the reviews table.
 */
export function ReviewsSection({ reviews }: ReviewsSectionProps) {
    const { t, locale } = useTranslation();

    if (reviews.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t('landing_reviews_title')}</h2>
                <p className="mt-3 text-base text-white/80">{t('landing_reviews_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => {
                    const clinicName = pickName(locale, review.clinic_name_en, review.clinic_name_ar);

                    return (
                        <figure
                            key={review.id}
                            className="relative rounded-2xl border border-white/25 bg-white p-6 shadow-xl dark:bg-slate-800"
                        >
                            <Quote className="absolute end-5 top-5 h-8 w-8 text-violet-100 dark:text-slate-700" />
                            <RatingStars rating={review.rating} />
                            <blockquote className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                “{review.comment}”
                            </blockquote>
                            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-gradient text-sm font-bold text-white">
                                    {initials(review.user_name)}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                        {review.user_name ?? t('landing_reviews_anonymous')}
                                    </div>
                                    {clinicName && (
                                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {clinicName}
                                        </div>
                                    )}
                                </div>
                            </figcaption>
                        </figure>
                    );
                })}
            </div>
        </section>
    );
}
