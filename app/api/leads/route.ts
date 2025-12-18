import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client'; // Note: Should usage server client for better security if possible, keeping simple for now
import { leadSchema } from '@/lib/schemas';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate on server
        const validation = leadSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const data = validation.data;

        // Calculate Score
        let score = 0;
        if (data.investment_ok) score += 50;
        if (data.commitment === 'ready') score += 30;
        if (data.lab_file_url) score += 20;

        // Handle Triage Redirection logic
        const isHighValue = score >= 70;
        const redirectUrl = isHighValue ? process.env.NEXT_PUBLIC_CALENDLY_LINK : null;
        const status = isHighValue ? 'meet_agendado' : 'nuevo'; // Or 'nuevo' and let them book?

        // Save to Supabase
        // Ideally use a Service Role client here to bypass RLS if strictly private, 
        // but we have "Enable insert for everyone" policy.
        const { error } = await supabase
            .from('leads')
            .insert({
                full_name: data.full_name,
                email: data.email,
                whatsapp: data.whatsapp,
                age: data.age,
                location: data.location,
                medical_context: data.medical_context,
                lab_file_url: data.lab_file_url,
                investment_ok: data.investment_ok,
                commitment: data.commitment,
                score: score,
                status: 'nuevo' // Keep as nuevo initially, let generic process logic handle status updates
            });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ success: true, redirectUrl, score });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
