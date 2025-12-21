import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Bio() {
    const t = useTranslations('Bio');

    return (
        <section id="bio" className="w-full py-10 bg-accent/10">
            <div className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
                {/* Contenedor de Imagen con Proporción Vertical */}
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-muted rounded-3xl overflow-hidden shadow-2xl border border-primary/10">
                    <Image
                        src="/images/dra-foto-bio.webp"
                        alt="Dra. Silvia Vildoza - Especialista en TRHB"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Contenido de Texto */}
                <div className="space-y-8">
                    <header className="space-y-2">
                        <h2 className="font-display text-4xl lg:text-5xl text-[var(--foreground)] leading-tight">
                            {t('title')}
                        </h2>
                        <div className="h-1 w-20 bg-[var(--primary)]"></div>
                    </header>

                    <div className="space-y-6 text-[var(--foreground)]/90 leading-relaxed font-sans text-lg">
                        {/* Introducción Profesional */}
                        <p>{t('intro')}</p>

                        {/* Historia Personal - Estilo Quote para mayor impacto emocional */}
                        <div className="border-l-4 border-[var(--accent)] pl-6 py-2 my-8 bg-[var(--accent)]/5 rounded-r-lg">
                            <p className="italic text-[var(--foreground)]">
                                {t('personal_story')}
                            </p>
                        </div>

                        {/* El Método */}
                        <div className="space-y-3">
                            <h3 className="text-[var(--primary)] font-display text-2xl font-semibold">
                                {t('method_title')}
                            </h3>
                            <p className="text-base lg:text-lg">
                                {t('method_desc')}
                            </p>
                        </div>

                        {/* La Promesa Final */}
                        <p className="font-medium text-[var(--foreground)] border-t border-[var(--primary)]/20 pt-6 italic">
                            {t('promise')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}