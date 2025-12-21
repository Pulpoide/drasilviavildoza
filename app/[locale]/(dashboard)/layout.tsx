import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import AdminNavbar from '@/components/layout/AdminNavbar';

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="min-h-screen bg-slate-50/50">
                <AdminNavbar />
                <main className="max-w-7xl mx-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </NextIntlClientProvider>
    );
}