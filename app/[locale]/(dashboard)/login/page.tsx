'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Lock, Mail, ChevronRight } from 'lucide-react'; // Iconos para un look más premium

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Error de autenticación: ' + error.message);
        } else {
            router.push('/admin');
        }
        setLoading(false);
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
            <Card className="w-full max-w-md border border-primary/5 shadow-[0_20px_50px_rgba(180,160,120,0.1)] rounded-[3rem] bg-white/80 backdrop-blur-sm overflow-hidden animate-in fade-in zoom-in duration-700">
                <CardHeader className="pt-14 pb-8 text-center space-y-2">
                    <CardTitle className="font-display text-4xl text-primary font-normal tracking-tight">
                        Admin Access
                    </CardTitle>
                    <p className="text-foreground/50 text-xs uppercase tracking-[0.15em] font-medium">
                        Gestión de Pacientes y Protocolos
                    </p>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-6 px-10 md:px-14">
                        {/* Campo Email */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 ml-1 group-focus-within:text-primary transition-colors">
                                Email Profesional
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 w-4 h-4" />
                                <Input
                                    type="email"
                                    placeholder="doctora@ejemplo.com"
                                    className="pl-12 rounded-2xl border-none bg-primary/5 focus-visible:ring-1 focus-visible:ring-primary/20 py-7 text-sm transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 ml-1 group-focus-within:text-primary transition-colors">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 w-4 h-4" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 rounded-2xl border-none bg-primary/5 focus-visible:ring-1 focus-visible:ring-primary/20 py-7 text-sm transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-8 pb-14 px-10 md:px-14">
                        <Button
                            type="submit"
                            className="w-full py-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer group"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">Verificando...</span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Ingresar al Panel
                                    <ChevronRight className="w-3 h-3 opacity-50 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}