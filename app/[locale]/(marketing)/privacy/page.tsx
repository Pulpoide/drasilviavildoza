import { getTranslations } from 'next-intl/server';

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations('PrivacyPage');

    return (
        <main className="min-h-screen bg-[#FDFCFB] pt-20 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Cabecera con estilo de marca */}
                <header className="mb-16 border-b border-primary/10 pb-10">
                    <h1 className="text-4xl md:text-6xl font-display text-primary italic mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground font-medium italic">
                        {t('lastUpdate')}: 21 de diciembre, 2025
                    </p>
                </header>

                {/* Contenido formateado con prose para legibilidad */}
                <article className="prose prose-stone max-w-none space-y-12 text-foreground/80 leading-relaxed">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('section1.title')}
                        </h2>
                        <p>{t('section1.content')}</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('section2.title')}
                        </h2>
                        <p>{t('section2.content')}</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{t('section2.items.personal')}</li>
                            <li>{t('section2.items.medical')}</li>
                            <li>{t('section2.items.files')}</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('section3.title')}
                        </h2>
                        <p>{t('section3.content')}</p>
                    </section>

                    {/* Banner de Contacto Final */}
                    <section className="mt-16 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 shadow-sm">
                        <h3 className="text-2xl font-display text-primary mb-4 italic">
                            {t('contact.title')}
                        </h3>
                        <p className="text-base italic opacity-80 font-medium">
                            {t('contact.description')}
                        </p>
                        <div className="mt-6 pt-6 border-t border-primary/10 text-xs uppercase tracking-widest opacity-40">
                            Dra. Silvia Vildoza — Medicina de Longevidad
                        </div>
                    </section>
                </article>
            </div>
        </main>
    );
}