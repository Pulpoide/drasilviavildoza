// components/layout/TopBanner.tsx
"use client";

import { useTranslations } from 'next-intl';
import { MapPin, Calendar } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function TopBanner() {
    const t = useTranslations('TopBanner');
    const pathname = usePathname();
    const isHome = pathname === '/' || pathname === '/es' || pathname === '/pt' || pathname === '/en';

    const location = "Córdoba, Argentina";
    const dates = "Enero 2026";

    if (!isHome) return null;

    return (
        <div className="bg-primary text-primary-foreground py-2 px-4 w-full">
            <div className="container mx-auto flex items-center justify-center gap-4 md:gap-8 text-[11px] md:text-xs uppercase tracking-[0.15em] font-semibold">

                <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-accent" />
                    <span>{t('next_location', { location })}</span>
                </div>

                {/* Separador visual elegante */}
                <div className="hidden md:block w-px h-3 bg-primary-foreground/20" />

                <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-accent" />
                    <span>{t('dates', { dates })}</span>
                </div>
            </div>
        </div>
    );
}