import { getTranslations } from 'next-intl/server';
import MultiStepForm from '@/components/multistep/MultiStepForm';

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function ProgramPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations('ProgramPage');

    return (
        <main className="min-h-screen pt-10 md:pt-15 pb-20 bg-[#FDFCFB]">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-display text-center text-primary mb-6">
                    {t('title')}
                </h1>

                <p className="text-center text-foreground/70 mb-5 md:mb-10 max-w-2xl mx-auto italic font-medium leading-relaxed px-4">
                    {t('description')}
                </p>

                <div className="max-w-4xl mx-auto">
                    <MultiStepForm />
                </div>
            </div>
        </main>
    );
}