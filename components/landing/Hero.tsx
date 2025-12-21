import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('Hero');
    const tFooter = useTranslations('Footer');

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const message = tFooter('cari_message');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <section className="relative w-full py-20 md:py-32 lg:py-48 bg-accent/12 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[var(--foreground)] font-bold tracking-tight mb-6">
                    {t('title')}
                </h1>
                <p className="font-sans text-lg md:text-2xl text-[var(--foreground)]/80 max-w-[800px] mb-10">
                    {t('subtitle')}
                </p>
                <p className="font-sans text-lg md:text-xm text-[var(--foreground)]/80 max-w-[800px] mb-10">
                    {t('description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mt-8">
                    <Link
                        href="/program-trh"
                        className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-8 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-hidden"
                    >
                        {t('cta_program')}
                    </Link>

                    <Link
                        href="#trh"
                        className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] border border-[var(--primary)] bg-transparent px-8 text-sm font-medium text-[var(--primary)] shadow-sm transition-colors hover:bg-[var(--primary)]/10 active:scale-95 focus-visible:outline-hidden"
                    >
                        {t('cta_general')}
                    </Link>
                </div>
            </div>

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)]/20 via-transparent to-transparent opacity-50"></div>
        </section>
    );
}
