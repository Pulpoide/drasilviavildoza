import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { minScore, location } = await searchParams;
    const supabase = await createClient();

    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (minScore) query = query.gte('score', parseInt(minScore as string));
    if (location) query = query.eq('location', location as string);

    const { data: leads, error } = await query;

    if (error) {
        console.error("Error fetching leads:", error);
    }

    return <AdminDashboardClient leads={leads || []} />
}
