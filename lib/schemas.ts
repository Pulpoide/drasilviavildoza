import * as z from "zod";

export const leadSchema = z.object({
    // Paso 1: Datos Personales
    full_name: z.string().min(3, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    sex: z.enum(["female", "male"]),
    country_code: z.string(),
    whatsapp: z.string().min(7, "Número incompleto"),
    age: z.coerce.number().min(18, "Debes ser mayor de 18 años").max(100, "Debes ser menor de 100 años"),
    gestas: z.coerce.number().optional().default(0),
    location: z.string().default("Argentina"),

    // Paso 2 y 3: Contexto Médico (Anamnesis de la Doc)
    medical_context: z.object({
        reason: z.string().min(5, "Contanos un poco más"),
        symptoms: z.string().min(5, "Describe tus síntomas"),
        hasUterus: z.enum(["yes", "no", "not_applicable"]).optional(),
        // Los campos fundamentales que pidió Silvia:
        app: z.string().min(2, "Por favor completa este campo (o pon 'Ninguna')"),
        apf: z.string().min(2, "Por favor completa este campo (o pon 'Ninguna')"),
        cancer_history: z.string().min(2, "Dato vital para la seguridad"),
        surgical_history: z.string().min(2, "Dato vital para la seguridad"),
        allergies: z.string().min(2, "Importante para el tratamiento"),
    }),

    // Paso 4: Estudios
    lab_file_url: z.string().url().optional().nullable(),

    // Paso 5: Compromiso
    investment_ok: z
        .boolean()
        .refine((val) => val === true, {
            message: "Este requisito es indispensable para el programa",
        }),
    commitment: z.enum(["ready", "doubts", "info"]),
});

// Esto es lo que usa tu componente MultiStepForm
export type LeadFormData = z.infer<typeof leadSchema>;