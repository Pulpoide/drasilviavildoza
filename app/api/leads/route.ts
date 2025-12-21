import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { leadSchema } from '@/lib/schemas';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const data = validation.data;

        // Scoring solo como "Termómetro de Interés" para el Dashboard
        let internalScore = 0;
        if (data.commitment === 'ready') internalScore = 100; // Prioridad máxima
        else if (data.commitment === 'doubts') internalScore = 50;
        else internalScore = 10;

        // Guardamos todo en Supabase
        const { error } = await supabase
            .from('leads')
            .insert({
                full_name: data.full_name,
                email: data.email,
                whatsapp: `${data.country_code}${data.whatsapp}`,
                age: data.age,
                sex: data.sex,
                gestas: data.sex === 'female' ? data.gestas : 0,
                location: data.location,
                medical_context: data.medical_context,
                lab_file_url: data.lab_file_url,
                investment_ok: data.investment_ok,
                commitment: data.commitment,
                score: internalScore, // Esto servirá para ordenar la tabla de la Doc
                status: 'pending'
            });

        if (error) throw error;

        // Ya no enviamos redirectUrl. Siempre devolvemos éxito.
        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}