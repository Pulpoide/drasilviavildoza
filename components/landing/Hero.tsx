import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <section className="relative w-full py-20 md:py-32 lg:py-48 bg-[var(--background)] overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--foreground)] font-bold tracking-tight mb-6">
                    {t('title')}
                </h1>
                <p className="font-sans text-lg md:text-xl text-[var(--foreground)]/80 max-w-[800px] mb-10">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                    <Link
                        href="/program-trh"
                        className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-8 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {t('cta_program')}
                    </Link>
                    <a // External or special link handling for WhatsApp
                        href={process.env.NEXT_PUBLIC_WHATSAPP_LINK || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] border border-[var(--primary)] bg-transparent px-8 text-sm font-medium text-[var(--primary)] shadow-sm transition-colors hover:bg-[var(--primary)]/10 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {t('cta_general')}
                    </a>
                </div>
            </div>

            {/* Decorative background elements if any */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)]/20 via-transparent to-transparent opacity-50"></div>
        </section>
    );
}
