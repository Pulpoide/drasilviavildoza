import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { Metadata } from 'next';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Dra. Silvia Vildoza | Bienestar Hormonal y TRH',
  description: 'Especialista en Ginecología y Terapias de Reemplazo Hormonal (TRH). Recupera tu vitalidad, energía y equilibrio con un enfoque médico personalizado.',
  openGraph: {
    title: 'Dra. Silvia Vildoza | Medicina de Longevidad',
    description: 'Transforma tu calidad de vida. Evaluación hormonal personalizada para hombres y mujeres.',
    images: ['/images/og-image.jpg'], // Una foto de ella o del logo dorado
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
