import MultiStepForm from '@/components/multistep/MultiStepForm';

export default function ProgramPage() {
    return (
        <div className="min-h-screen py-20 bg-[var(--background)]">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl font-display text-center text-[var(--foreground)] mb-4">
                    Programa TRH Bioidéntica
                </h1>
                <p className="text-center text-[var(--foreground)]/70 mb-12 max-w-2xl mx-auto">
                    Completa este formulario para evaluar tu caso. La Dra. Silvia analizará tu información para determinar la mejor ruta de tratamiento.
                </p>
                <MultiStepForm />
            </div>
        </div>
    );
}
