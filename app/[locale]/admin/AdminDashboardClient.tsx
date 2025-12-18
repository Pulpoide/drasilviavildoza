'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Standard next nav for admin
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboardClient({ leads }: { leads: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic update or reload? Reload simplest.
        await supabase.from('leads').update({ status: newStatus }).eq('id', id);
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display">Inbox de Leads</h2>
                <div className="flex gap-2">
                    <select
                        className="p-2 border rounded"
                        onChange={(e) => handleFilter('location', e.target.value)}
                        defaultValue={searchParams.get('location') || ''}
                    >
                        <option value="">Todas las ubicaciones</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <select
                        className="p-2 border rounded"
                        onChange={(e) => handleFilter('minScore', e.target.value)}
                        defaultValue={searchParams.get('minScore') || ''}
                    >
                        <option value="">Cualquier Score</option>
                        <option value="70">Alta Prioridad (>70)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Edad</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">No se encontraron leads.</TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id} className={lead.score >= 70 ? 'bg-yellow-50/50' : ''}>
                                    <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                                    <TableCell>{lead.age}</TableCell>
                                    <TableCell>{lead.location}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {lead.score}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className="text-xs p-1 border rounded bg-transparent"
                                        >
                                            <option value="nuevo">Nuevo</option>
                                            <option value="contactado">Contactado</option>
                                            <option value="meet_agendado">Meet</option>
                                            <option value="finalizado">Finalizado</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {lead.whatsapp && (
                                                <a href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="text-green-600 hover:text-green-800" title="WhatsApp">
                                                    <MessageCircle className="w-4 h-4" />
                                                </a>
                                            )}
                                            {lead.lab_file_url && (
                                                <a href={lead.lab_file_url} target="_blank" className="text-blue-600 hover:text-blue-800" title="Ver Estudios">
                                                    <FileText className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
