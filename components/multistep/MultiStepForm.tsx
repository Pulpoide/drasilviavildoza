'use client';

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle2, FileUp, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

import { leadSchema, type LeadFormData } from '@/lib/schemas';

// 1. Constantes Unificadas y Limpias
const COUNTRY_DATA = {
    '+54': { name: 'Argentina', iso: 'ar', length: 10 },
    '+55': { name: 'Brasil', iso: 'br', length: 11 },
    '+598': { name: 'Uruguay', iso: 'uy', length: 8 },
    '+1': { name: 'USA', iso: 'us', length: 10 },
    '+34': { name: 'España', iso: 'es', length: 9 },
} as const;

type CountryCode = keyof typeof COUNTRY_DATA;

export default function MultiStepForm() {
    const t = useTranslations('ApplyForm');
    const locale = useLocale();
    const [step, setStep] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const methods = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema) as any,
        mode: 'onChange',
        defaultValues: {
            full_name: '',
            email: '',
            sex: 'female',
            whatsapp: '',
            age: 0 as any,
            gestas: 0 as any,
            country_code: locale === 'pt' ? '+55' : locale === 'en' ? '+1' : '+54',
            medical_context: {
                hasUterus: "yes",
                reason: '',
                symptoms: '',
                app: '',
                apf: '',
                cancer_history: '',
                surgical_history: '',
                allergies: ''
            },
            investment_ok: false,
            location: locale === 'pt' ? 'Brasil' : 'Argentina',
            commitment: 'ready'
        }
    });

    const { handleSubmit, trigger, watch, setValue, formState: { errors, isValid }, getValues } = methods;

    const selectedSex = watch('sex');
    const currentCountryCode = watch('country_code') as CountryCode;

    // 2. Formateador de WhatsApp
    const formatWhatsApp = (value: string, countryCode: string) => {
        let numbers = value.replace(/\D/g, '');

        const codeDigits = countryCode.replace(/\D/g, '');
        if (numbers.startsWith(codeDigits)) {
            numbers = numbers.slice(codeDigits.length);
        }

        if (countryCode === '+54' || countryCode === '+55') {
            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)}-${numbers.slice(6, 11)}`;
        }

        if (countryCode === '+598') {
            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 5) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)}`;
        }

        return numbers;
    };

    const steps = [
        { title: t('steps.basics.title'), description: t('steps.basics.desc') },
        { title: t('steps.medical.title'), description: t('steps.medical.desc') },
        { title: t('steps.history.title'), description: t('steps.history.desc') },
        { title: t('steps.labs.title'), description: t('steps.labs.desc') },
        { title: t('steps.commitment.title'), description: t('steps.commitment.desc') }
    ];

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ['full_name', 'email', 'whatsapp', 'country_code', 'age', 'location'];
        else if (step === 2) fieldsToValidate = ['medical_context.reason', 'medical_context.symptoms', 'medical_context.hasUterus'];
        else if (step === 3) fieldsToValidate = ['medical_context.app', 'medical_context.apf', 'medical_context.cancer_history', 'medical_context.surgical_history', 'medical_context.allergies'];
        else if (step === 5) fieldsToValidate = ['investment_ok', 'commitment'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) setStep(s => s + 1);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `labs/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('lab-files').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('lab-files').getPublicUrl(filePath);
            setValue('lab_file_url', data.publicUrl, { shouldValidate: true });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al subir el archivo.');
        } finally { setUploading(false); }
    };

    const dispararConfeti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#C5A059', '#D4AF37', '#F7EFE9'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#C5A059', '#D4AF37', '#F7EFE9'] });
        }, 250);
    };

    const onSubmit: SubmitHandler<LeadFormData> = async (data) => {
        setIsProcessing(true)
        try {
            const sanitizedData = {
                ...data,
                whatsapp: data.whatsapp.replace(/\D/g, ''),
                full_name: data.full_name.trim(),
                email: data.email.toLowerCase().trim(),
            };

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedData),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setFinalResult(result);
                setIsSubmitted(true);
                dispararConfeti();
            } else {
                alert(result.error || "Hubo un problema.");
            }
        } catch (e) {
            alert("Error de conexión.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 text-center">
                <Card className="p-12 border-none shadow-2xl bg-white/80 backdrop-blur">
                    <div className="flex justify-center mb-6 text-primary">
                        <CheckCircle2 size={80} strokeWidth={1} className="animate-bounce" />
                    </div>
                    <h3 className="font-display text-4xl text-primary mb-6">{t('success.title')}</h3>
                    <p className="text-foreground/80 text-lg leading-relaxed mb-8">{t('success.msg')}</p>
                    <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => window.location.href = '/'}>
                        Volver al inicio
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Indicadores de pasos... */}
            <div className="mb-12 flex justify-between items-center px-4">
                {steps.map((s, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 ${i + 1 <= step ? 'text-primary' : 'text-muted-foreground/40'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${i + 1 <= step ? 'border-primary bg-primary/5 font-bold' : 'border-muted'}`}>
                            {i + 1 < step ? <CheckCircle2 size={20} /> : i + 1}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest hidden md:block font-bold">{s.title}</span>
                    </div>
                ))}
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="shadow-lg border-primary/5 overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 mb-6">
                            <CardTitle className="text-2xl text-primary font-display">{steps[step - 1].title}</CardTitle>
                            <CardDescription>{steps[step - 1].description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label>Sexo Biológico</Label>
                                        <select {...methods.register('sex')} className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                                            <option value="female">Femenino</option>
                                            <option value="male">Masculino</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t('fields.name')}</Label>
                                        <Input {...methods.register('full_name')} placeholder={selectedSex === 'female' ? "Ana García" : "Juan Pérez"} />
                                        {errors.full_name && <p className="text-destructive text-xs italic">{errors.full_name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t('fields.email')}</Label>
                                        <Input type="email" {...methods.register('email')} placeholder="email@ejemplo.com" />
                                        {errors.email && <p className="text-destructive text-xs italic">{errors.email.message}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{t('fields.age')}</Label>
                                            <Input type="number" {...methods.register('age')} />
                                        </div>
                                        {selectedSex === 'female' && (
                                            <div className="space-y-2">
                                                <Label>{t('fields.gestas')}</Label>
                                                <Input type="number" {...methods.register('gestas')} />
                                            </div>
                                        )}
                                    </div>

                                    {/* WHATSAPP RE-DISEÑADO */}
                                    <div className="space-y-2">
                                        <Label>{t('fields.whatsapp')}</Label>
                                        <div className="relative">
                                            <div className={`flex items-stretch shadow-sm rounded-xl overflow-hidden border transition-all ${errors.whatsapp ? 'border-destructive' : 'border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'
                                                }`}>

                                                {/* Contenedor del Prefijo y Bandera */}
                                                <div className="relative flex items-center bg-muted/30 border-r px-3 gap-2 min-w-[100px]">
                                                    {/* Imagen de la bandera real (FlagCDN) */}
                                                    <img
                                                        src={`https://flagcdn.com/w40/${COUNTRY_DATA[currentCountryCode]?.iso}.png`}
                                                        alt="Flag"
                                                        className="w-5 h-auto object-contain"
                                                    />
                                                    <span className="text-sm font-bold">{currentCountryCode}</span>
                                                    <ChevronDown size={14} className="text-muted-foreground ml-auto" />

                                                    {/* Select invisible encima para capturar el click */}
                                                    <select
                                                        {...methods.register('country_code', {
                                                            onChange: (e) => {
                                                                const code = e.target.value as CountryCode;
                                                                setValue('location', COUNTRY_DATA[code].name);
                                                                setValue('whatsapp', ''); // Limpiamos el número al cambiar de país
                                                            }
                                                        })}
                                                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                    >
                                                        {Object.entries(COUNTRY_DATA).map(([code, data]) => (
                                                            <option key={code} value={code}>
                                                                {data.name} ({code})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Input de Número con Validación de Longitud Específica */}
                                                <Input
                                                    {...methods.register('whatsapp', {
                                                        required: "El número es obligatorio",
                                                        onChange: (e) => {
                                                            const code = getValues('country_code') as CountryCode;
                                                            setValue('whatsapp', formatWhatsApp(e.target.value, code));
                                                        },
                                                        validate: (value) => {
                                                            const code = getValues('country_code') as CountryCode;
                                                            const numbersOnly = value.replace(/\D/g, '');
                                                            const requiredLen = COUNTRY_DATA[code].length;

                                                            if (numbersOnly.length !== requiredLen) {
                                                                return `Debe tener exactamente ${requiredLen} dígitos`;
                                                            }
                                                            return true;
                                                        }
                                                    })}
                                                    placeholder="Número de WhatsApp"
                                                    className="border-0 focus-visible:ring-0 shadow-none flex-1 h-12 bg-transparent"
                                                />
                                            </div>

                                            {/* Icono de Check: Solo si el número tiene la longitud EXACTA */}
                                            {!errors.whatsapp && watch('whatsapp').replace(/\D/g, '').length === COUNTRY_DATA[currentCountryCode].length && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                            )}
                                        </div>
                                        {errors.whatsapp && (
                                            <p className="text-destructive text-xs italic mt-1">{errors.whatsapp.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2"><Label>{t('fields.reason')}</Label><Textarea {...methods.register('medical_context.reason')} /></div>
                                    <div className="space-y-2"><Label>{t('fields.symptoms')}</Label><Textarea {...methods.register('medical_context.symptoms')} /></div>
                                    {selectedSex === 'female' && (
                                        <div className="space-y-4">
                                            <Label>{t('fields.uterus')}</Label>
                                            <div className="flex gap-8">
                                                {['yes', 'no'].map(v => (
                                                    <label key={v} className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            value={v}
                                                            {...methods.register('medical_context.hasUterus')}
                                                            className="accent-primary w-4 h-4 transition-transform group-hover:scale-110"
                                                        />
                                                        <span className="text-sm font-medium text-foreground/70 group-hover:text-primary transition-colors">
                                                            {t(`common.${v}`)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2"><Label>{t('fields.app')}</Label><Textarea {...methods.register('medical_context.app')} /></div>
                                    <div className="space-y-2"><Label>{t('fields.apf')}</Label><Textarea {...methods.register('medical_context.apf')} /></div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>{t('fields.cancer')}</Label><Textarea {...methods.register('medical_context.cancer_history')} /></div>
                                        <div className="space-y-2"><Label>{t('fields.surgical')}</Label><Textarea {...methods.register('medical_context.surgical_history')} /></div>
                                    </div>
                                    <div className="space-y-2"><Label>{t('fields.allergies')}</Label><Input {...methods.register('medical_context.allergies')} /></div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-primary/20 rounded-2xl p-10 text-center">
                                        <Input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" id="file-upload" />
                                        <Label htmlFor="file-upload" className="cursor-pointer bg-white border border-primary/20 px-6 py-3 rounded-full inline-block">
                                            {uploading ? <Loader2 className="animate-spin" /> : t('common.upload_btn')}
                                        </Label>
                                        {watch('lab_file_url') && <p className="mt-4 text-green-600 font-medium">✓ Archivo listo</p>}
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
                                        <input type="checkbox" {...methods.register('investment_ok')} className="w-5 h-5 accent-primary" />
                                        <Label className="text-sm">{t('fields.investment_text', { sex: selectedSex })}</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('fields.commitment')}</Label>
                                        <select {...methods.register('commitment')} className="w-full p-4 rounded-xl border">
                                            <option value="ready">{t('options.ready', { sex: selectedSex })}</option>
                                            <option value="doubts">{t('options.doubts')}</option>
                                            <option value="info">{t('options.info')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-between p-6 bg-muted/20 border-t border-primary/5">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep(s => s - 1)}
                                disabled={step === 1 || isProcessing}
                            >
                                {t('common.prev')}
                            </Button>

                            {step < 5 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-primary hover:bg-primary/90 px-8"
                                >
                                    {t('common.next')}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="bg-primary px-10"
                                >
                                    {isProcessing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        t('common.finish')
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </form>
            </FormProvider>
        </div>
    );
}