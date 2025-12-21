'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, MessageCircle, Eye, ClipboardList, User, AlertCircle, ShieldAlert, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

export default function AdminDashboardClient({ leads }: { leads: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedLocation = searchParams.get('location');
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');

    // Función para cambiar el estado en la base de datos
    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error detallado de Supabase:", error.message);
            alert("Error al guardar: " + error.message); // Esto te dirá si es un tema de permisos
        } else {
            router.refresh();
        }
    };

    const handleViewLab = async (filePath: string) => {
        // filePath es algo como "labs/archivo.pdf"
        // Extraemos solo la parte después de /lab-files/
        const path = filePath.split('lab-files/')[1];

        const { data, error } = await supabase
            .storage
            .from('lab-files')
            .createSignedUrl(path, 60); // La URL durará solo 60 segundos

        if (error) {
            console.error("Error al generar URL firmada:", error.message);
            alert("No se pudo acceder al archivo.");
            return;
        }

        if (data?.signedUrl) {
            window.open(data.signedUrl, '_blank');
        }
    };

    // Filtro de búsqueda por nombre, email y ubicación
    const filteredLeads = leads.filter(lead => {
        // Condición A: El buscador (nombre o email)
        const matchesSearch =
            lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Condición B: La ubicación (si no hay filtro, pasan todos)
        const matchesLocation = !selectedLocation || lead.location === selectedLocation;

        return matchesSearch && matchesLocation;
    });

    const clearFilters = () => {
        setSearchTerm('');
        router.replace(pathname);
    };

    const isFiltered = searchTerm !== '' || !!searchParams.get('location');

    // Generador de link de WhatsApp con mensaje pre-armado
    const getWhatsAppLink = (lead: any) => {
        const cleanNumber = lead.whatsapp.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(
            `Hola ${lead.full_name}, soy la Dra. Silvia Vildoza. He recibido tu aplicación para el programa de bienestar hormonal y me gustaría que coordinemos una breve entrevista.`
        );
        return `https://wa.me/${cleanNumber}?text=${message}`;
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-6 p-4 md:p-6 pb-20 max-w-7xl mx-auto">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-display text-primary font-bold">Gestión de Pacientes</h1>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 tracking-widest">ADMIN</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">Panel de control de aplicaciones médicas</p>
                </div>
            </header>

            {/* FILTROS Y BUSCADOR */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        className="pl-10 py-6 rounded-2xl border-primary/10 bg-white shadow-sm focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex w-full lg:w-auto gap-2 items-center">
                    {/* BOTÓN LIMPIAR (Solo aparece si hay filtros) */}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-primary transition-all rounded-2xl gap-2 h-12"
                        >
                            <X size={16} />
                            <span className="text-xs font-medium">Limpiar</span>
                        </Button>
                    )}

                    <select
                        className="text-sm p-3 border rounded-2xl bg-white border-primary/10 shadow-sm outline-none h-12"
                        onChange={(e) => handleFilter('location', e.target.value)}
                        value={searchParams.get('location') || ''}
                    >
                        <option value="">Todas las ubicaciones</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Uruguay">Uruguay</option>
                    </select>

                    <Badge variant="outline" className="h-12 px-6 bg-primary/5 border-primary/20 text-primary font-bold rounded-2xl whitespace-nowrap flex items-center">
                        {filteredLeads.length} de {leads.length} leads
                    </Badge>
                </div>
            </div>
            {/* TABLA */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-primary/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-primary/5">
                            <TableHead className="font-bold text-primary py-4 pl-6">Prioridad</TableHead>
                            <TableHead className="font-bold text-primary py-4">Paciente</TableHead>
                            <TableHead className="font-bold text-primary py-4">Estado</TableHead>
                            <TableHead className="font-bold text-primary py-4 text-right pr-6">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">
                                    No se encontraron pacientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id} className="group hover:bg-primary/5 transition-all border-primary/5">
                                    <TableCell className="pl-6">
                                        <Badge className={lead.commitment === 'ready' ? 'bg-amber-500 text-white' : 'bg-slate-300'}>
                                            {lead.commitment === 'ready' ? 'URGENTE' : 'CONSULTA'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{lead.full_name}</span>
                                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] py-0">{lead.location || 'Argentina'}</Badge>
                                                <Badge variant="outline" className="text-[10px] py-0">{lead.age} años</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className="text-xs p-1.5 border rounded-lg bg-white outline-none cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="contacted">Contactado</option>
                                            <option value="scheduled">Agendado</option>
                                            <option value="discarded">Descartado</option>
                                        </select>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            {/* NUEVO: Botón de Laboratorio rápido */}
                                            {lead.lab_file_url && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full text-blue-600 hover:bg-blue-50 border-blue-200 shadow-sm"
                                                    onClick={() => handleViewLab(lead.lab_file_url)}
                                                >
                                                    <FileText size={16} />
                                                </Button>
                                            )}
                                            {/* FICHA MÉDICA (MODAL) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                                                        <Eye size={16} />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl">
                                                    <DialogHeader className="border-b pb-4">
                                                        <DialogTitle className="font-display text-3xl text-primary flex items-center gap-3 italic">
                                                            <div className="p-2 bg-primary/10 rounded-xl"><User className="text-primary" size={24} /></div>
                                                            {lead.full_name}
                                                        </DialogTitle>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                                                        <div className="space-y-6">
                                                            <section>
                                                                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 flex items-center gap-2"><ClipboardList size={14} /> Motivo de Consulta</h4>
                                                                <div className="p-4 bg-slate-50 rounded-2xl text-sm leading-relaxed border border-slate-100">{lead.medical_context?.reason}</div>
                                                            </section>
                                                            <section>
                                                                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Síntomas</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {lead.medical_context?.symptoms?.split(',').map((s: string, i: number) => (
                                                                        <Badge key={i} variant="secondary" className="bg-white border-primary/10 text-primary">{s.trim()}</Badge>
                                                                    ))}
                                                                </div>
                                                            </section>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <section>
                                                                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Alertas Clínicas</h4>
                                                                <div className="space-y-3">
                                                                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${lead.medical_context?.cancer_history?.toLowerCase() !== 'no' ? 'bg-red-50 border-red-100 text-red-900' : 'bg-green-50 border-green-100 text-green-900'}`}>
                                                                        <div className="mt-1"><AlertCircle size={16} /></div>
                                                                        <div><p className="text-[10px] font-bold uppercase">Antecedentes Cáncer</p><p className="text-xs">{lead.medical_context?.cancer_history}</p></div>
                                                                    </div>
                                                                    <div className={`p-3 rounded-xl border flex items-start gap-3 ${lead.medical_context?.allergies?.toLowerCase() !== 'no' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                                                                        <div className="mt-1"><ShieldAlert size={16} /></div>
                                                                        <div><p className="text-[10px] font-bold uppercase">Alergias</p><p className="text-xs">{lead.medical_context?.allergies}</p></div>
                                                                    </div>
                                                                </div>
                                                            </section>

                                                            {/* CONDICIONAL: Solo mostrar si es mujer */}
                                                            {lead.sex === 'female' && (
                                                                <section className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                                                                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-center">
                                                                        <p className="text-[10px] text-primary/60 font-bold uppercase">Útero</p>
                                                                        <p className="font-display text-xl text-primary">
                                                                            {lead.medical_context?.hasUterus === 'yes' ? 'SÍ' : 'NO'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-center">
                                                                        <p className="text-[10px] text-primary/60 font-bold uppercase">Gestas</p>
                                                                        <p className="font-display text-xl text-primary">
                                                                            {lead.gestas || 0}
                                                                        </p>
                                                                    </div>
                                                                </section>
                                                            )}

                                                        </div>
                                                    </div>

                                                    <div className="border-t pt-6 flex gap-3">
                                                        {lead.lab_file_url && (
                                                            <Button
                                                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6"
                                                                onClick={() => handleViewLab(lead.lab_file_url)}
                                                            >
                                                                <FileText className="mr-2" size={18} /> Ver Laboratorios
                                                            </Button>
                                                        )}
                                                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6" asChild>
                                                            <a href={getWhatsAppLink(lead)} target="_blank"><MessageCircle className="mr-2" size={18} /> Contactar</a>
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* WHATSAPP RÁPIDO */}
                                            <Button variant="outline" size="icon" className="rounded-full text-green-600 hover:bg-green-50 border-green-200 shadow-sm" asChild>
                                                <a href={getWhatsAppLink(lead)} target="_blank"><MessageCircle size={16} /></a>
                                            </Button>
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