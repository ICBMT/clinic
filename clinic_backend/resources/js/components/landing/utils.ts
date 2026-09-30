import { type LucideIcon, Flower2, Gem, HeartPulse, Sparkles, Sun, Syringe, Wand2, Zap } from 'lucide-react';

/**
 * Pick the localized field for the active locale, falling back to the
 * other language when the preferred one is empty.
 */
export function pickName(locale: string, en: string | null | undefined, ar: string | null | undefined): string {
    if (locale === 'ar') {
        return (ar && ar.trim() !== '' && ar) || en || '';
    }

    return (en && en.trim() !== '' && en) || ar || '';
}

/**
 * Icon set cycled across dynamic category cards so every category gets a
 * tasteful glyph without needing per-row icon configuration.
 */
const categoryIcons: LucideIcon[] = [Sparkles, Gem, Flower2, Zap, Sun, Wand2, Syringe, HeartPulse];

export function categoryIcon(index: number): LucideIcon {
    return categoryIcons[index % categoryIcons.length];
}

/**
 * Initials for avatar fallbacks (works for Arabic names too).
 */
export function initials(name: string | null | undefined): string {
    if (!name) {
        return '?';
    }

    const parts = name.trim().split(/\s+/).slice(0, 2);

    return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?';
}
