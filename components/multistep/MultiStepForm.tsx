'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormData } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Need to create Step components using these
// import Step1 from './Step1';
// import Step2 from './Step2';
// ...
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

export default function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    const methods = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        mode: 'onChange',
        defaultValues: {
            location: undefined,
            medical_context: {
                hasUterus: undefined
            }
        }
    });

    const { handleSubmit, trigger, formState: { isValid } } = methods;

    const steps = [
        { title: "Datos Personales", description: "Cuéntanos sobre ti" },
        { title: "Contexto Médico", description: "Tu salud actual" },
        { title: "Estudios", description: "Laboratorios recientes" },
        { title: "Compromiso", description: "Tu inversión en salud" }
    ];

    const nextStep = async () => {
        // Validate current step fields before moving
        let fieldsToValidate: (keyof LeadFormData)[] = [];
        if (step === 1) fieldsToValidate = ['full_name', 'email', 'whatsapp', 'age', 'location'];
        if (step === 2) {
            // Deep validation not fully supported by trigger(key) if key is object, but usually works for z.object
            // For React Hook Form nested paths: 'medical_context.reason'
            // Casting to any to allow nested paths
            fieldsToValidate = ['medical_context.reason', 'medical_context.symptoms', 'medical_context.hasUterus'] as any;
        }
        // Step 3 is optional upload
        if (step === 4) fieldsToValidate = ['investment_ok', 'commitment'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => {
        setStep(s => s - 1);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('lab-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('lab-files').getPublicUrl(filePath);
            methods.setValue('lab_file_url', data.publicUrl);
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: LeadFormData) => {
        // Submit logic
        console.log("Submitting", data);
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                alert("Gracias, Cari se contactará contigo.");
            }
        } catch (e) {
            console.error(e);
            alert("Error al enviar el formulario.");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-8 flex justify-between items-center px-2">
                {steps.map((s, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 ${i + 1 === step ? 'text-[var(--primary)]' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i + 1 === step ? 'border-[var(--primary)] font-bold' : 'border-gray-300'}`}>
                            {i + 1}
                        </div>
                        <span className="text-xs hidden md:block">{s.title}</span>
                    </div>
                ))}
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-[var(--primary)]">{steps[step - 1].title}</CardTitle>
                            <CardDescription>{steps[step - 1].description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nombre Completo</Label>
                                            <Input {...methods.register('full_name')} placeholder="Tu nombre" />
                                            {methods.formState.errors.full_name && <p className="text-red-500 text-xs">{methods.formState.errors.full_name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input {...methods.register('email')} placeholder="tu@email.com" />
                                            {methods.formState.errors.email && <p className="text-red-500 text-xs">{methods.formState.errors.email.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>WhatsApp</Label>
                                            <Input {...methods.register('whatsapp')} placeholder="+54..." />
                                            {methods.formState.errors.whatsapp && <p className="text-red-500 text-xs">{methods.formState.errors.whatsapp.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Edad</Label>
                                            <Input type="number" {...methods.register('age')} placeholder="35" />
                                            {methods.formState.errors.age && <p className="text-red-500 text-xs">{methods.formState.errors.age.message}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ubicación</Label>
                                        <select {...methods.register('location')} className="flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 shadow-sm md:text-sm">
                                            <option value="">Seleccionar...</option>
                                            <option value="Argentina">Argentina</option>
                                            <option value="Brasil">Brasil</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                        {methods.formState.errors.location && <p className="text-red-500 text-xs">{methods.formState.errors.location.message}</p>}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label>Motivo de Consulta</Label>
                                        <Textarea {...methods.register('medical_context.reason')} placeholder="¿Qué te trae por aquí?" />
                                        {methods.formState.errors.medical_context?.reason && <p className="text-red-500 text-xs">{methods.formState.errors.medical_context.reason.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Síntomas Principales</Label>
                                        <Textarea {...methods.register('medical_context.symptoms')} placeholder="Sofocos, insomnio, cansancio..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>¿Tienes útero?</Label>
                                        {/* Radio Group Manual Implementation or Component */}
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" value="yes" {...methods.register('medical_context.hasUterus')} /> Sí
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" value="no" {...methods.register('medical_context.hasUterus')} /> No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <p className="text-sm text-[var(--muted-foreground)]">Si tienes laboratorios hormonales recientes (menos de 6 meses), súbelos aquí. Esto nos ayuda a priorizar tu caso.</p>
                                    <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:bg-[var(--accent)]/5 transition-colors">
                                        <Input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="cursor-pointer" />
                                        {uploading && <p className="text-sm mt-2 text-[var(--primary)]">Subiendo...</p>}
                                        {methods.watch('lab_file_url') && <p className="text-sm mt-2 text-green-600">¡Archivo subido exitosamente!</p>}
                                    </div>
                                    {/* Hidden field actually stores the URL */}
                                    <input type="hidden" {...methods.register('lab_file_url')} />
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-4 bg-[var(--accent)]/20 rounded-lg border border-[var(--accent)]">
                                        <h4 className="font-display text-lg mb-2 text-[var(--foreground)]">Inversión en tu Salud</h4>
                                        <p className="text-sm text-[var(--foreground)]/90 mb-4">
                                            Trabajamos de manera 100% particular para garantizarte el tiempo y la dedicación que mereces. La consulta y el tratamiento TRH requieren una inversión económica.
                                        </p>
                                        <div className="flex items-start gap-2">
                                            <input type="checkbox" id="inv_ok" {...methods.register('investment_ok')} className="mt-1" />
                                            <Label htmlFor="inv_ok" className="leading-tight">Entiendo que es una atención privada y estoy dispuesta a invertir en mi tratamiento.</Label>
                                        </div>
                                        {methods.formState.errors.investment_ok && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.investment_ok.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>¿Cuál es tu nivel de compromiso?</Label>
                                        <select {...methods.register('commitment')} className="w-full p-2 rounded-md border border-[var(--input)] bg-white">
                                            <option value="ready">Estoy lista para empezar ya</option>
                                            <option value="doubts">Tengo algunas dudas</option>
                                            <option value="info_only">Solo quiero información</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-[var(--border)]/50 pt-6">
                            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                                Atrás
                            </Button>
                            {step < 4 ? (
                                <Button type="button" onClick={nextStep}>
                                    Siguiente
                                </Button>
                            ) : (
                                <Button type="submit">
                                    Finalizar
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </form>
            </FormProvider>
        </div>
    );
}
