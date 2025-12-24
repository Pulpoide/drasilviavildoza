import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Playfair_Display } from 'next/font/google';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    const baseUrl = 'https://www.dravildoza.com/';

    return {
        title: t('title'),
        description: t('description'),
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-icon.png',
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${baseUrl}/${locale}`,
            type: 'website',
            siteName: 'Dra. Silvia Vildoza',
            images: [
                {
                    url: `images/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: t('title'),
                },
            ],
            locale: locale,
        },
    };
}

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair'
});

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${inter.variable} ${playfair.variable} antialiased font-sans bg-[#FDFCFB]`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}