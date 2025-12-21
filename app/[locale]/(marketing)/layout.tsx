import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Playfair_Display, Inter } from "next/font/google";
import "@/app/globals.css";
import { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import TopBanner from '@/components/layout/TopBanner';

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Dra. Silvia Vildoza | Ginecología Integral',
  description: 'Especialista en Ginecología y Terapias de Reemplazo Hormonal (TRH).',
};

export default async function MarketingLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <>
      <TopBanner />
      <Navbar />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}