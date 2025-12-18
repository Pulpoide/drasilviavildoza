import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/es/admin/login'); // Hardcoded locale redirect for simplicity or use middleware
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar could go here */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
                <h1 className="font-display text-xl mb-8">Dra. Silvia Admin</h1>
                <nav className="space-y-2">
                    <a href="/es/admin" className="block p-2 rounded hover:bg-gray-100 font-medium">Leads</a>
                    <form action="/api/auth/signout" method="post">
                        <button className="text-sm text-red-500 mt-4">Cerrar Sesión</button>
                    </form>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
