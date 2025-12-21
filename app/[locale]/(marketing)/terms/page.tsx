import { getTranslations } from 'next-intl/server';

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations('TermsPage');

    return (
        <main className="min-h-screen bg-[#FDFCFB] pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Encabezado */}
                <header className="mb-16 border-b border-primary/10 pb-10">
                    <h1 className="text-4xl md:text-6xl font-display text-primary italic mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground font-medium italic">
                        {t('lastUpdate')}: 21 de diciembre, 2025
                    </p>
                </header>

                {/* Contenido Legal */}
                <article className="prose prose-stone max-w-none space-y-12 text-foreground/80 leading-relaxed">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('sections.general.title')}
                        </h2>
                        <p>{t('sections.general.content')}</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('sections.appointments.title')}
                        </h2>
                        <p>{t('sections.appointments.content')}</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-display text-primary italic">
                            {t('sections.medical.title')}
                        </h2>
                        <p>{t('sections.medical.content')}</p>
                    </section>

                    {/* Nota aclaratoria con estilo */}
                    <section className="mt-16 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 shadow-sm">
                        <h3 className="text-2xl font-display text-primary mb-4 italic">
                            {t('footer_note.title')}
                        </h3>
                        <p className="text-base italic opacity-80 font-medium">
                            {t('footer_note.description')}
                        </p>
                    </section>
                </article>
            </div>
        </main>
    );
}