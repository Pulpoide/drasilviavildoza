import { z } from "zod";

export const leadSchema = z.object({
    full_name: z.string().min(2, "El nombre completo es requerido"),
    email: z.string().email("Email inválido"),
    whatsapp: z.string().min(8, "Número de WhatsApp requerido"),
    age: z.coerce.number().min(18, "Debes ser mayor de 18 años").max(100, "Edad no válida"),
    location: z.enum(["Argentina", "Brasil", "Otro"]),
    medical_context: z.object({
        reason: z.string().min(10, "Por favor detalla el motivo de consulta"),
        symptoms: z.string().optional(),
        hasUterus: z.enum(["yes", "no", "unknown"]).optional(),
        medications: z.string().optional(),
        allergies: z.string().optional(),
        cancerHistory: z.string().optional(), // 'personal', 'family', 'none' could be enum, keeping simple string for now
    }),
    // lab_file_url handled separately in component state or hidden field
    lab_file_url: z.string().optional(),
    investment_ok: z.boolean().refine((val) => val === true, {
        message: "Debes confirmar que entiendes que es una inversión privada",
    }),
    commitment: z.enum(['ready', 'doubts', 'info_only']),
});

export type LeadFormData = z.infer<typeof leadSchema>;
