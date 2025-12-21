import { createClient } from '@/lib/supabase/server'; // El que acabamos de ajustar
import AdminDashboardClient from './AdminDashboardClient';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
    const supabase = await createClient();

    // Verificamos sesión
    const { data: { session } } = await supabase.auth.getSession();

    // Si no hay sesión, mandamos al login (el middleware ya lo hace, pero esto es doble seguridad)
    if (!session) redirect('/login');

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false });

    return <AdminDashboardClient leads={leads || []} />;
}