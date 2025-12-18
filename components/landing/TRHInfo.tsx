export default function TRHInfo() {
    return (
        <section className="py-20 bg-[var(--muted)]/30">
            <div className="container px-4 mx-auto text-center max-w-3xl">
                <h2 className="font-display text-3xl md:text-4xl text-[var(--foreground)] mb-8">
                    Terapia de Reemplazo Hormonal Bioidéntica
                </h2>
                <p className="text-lg text-[var(--foreground)]/90 mb-12">
                    Un enfoque moderno y personalizado para restaurar tu equilibrio hormonal y mejorar tu calidad de vida.
                </p>
                <div className="grid sm:grid-cols-3 gap-8">
                    <div className="p-6 bg-[var(--background)] rounded-[var(--radius)] shadow-sm">
                        <h3 className="font-display text-xl text-[var(--primary)] mb-3">Energía</h3>
                        <p className="text-sm">Recupera la vitalidad física y mental.</p>
                    </div>
                    <div className="p-6 bg-[var(--background)] rounded-[var(--radius)] shadow-sm">
                        <h3 className="font-display text-xl text-[var(--primary)] mb-3">Equilibrio</h3>
                        <p className="text-sm">Estabilidad emocional y mejor descanso.</p>
                    </div>
                    <div className="p-6 bg-[var(--background)] rounded-[var(--radius)] shadow-sm">
                        <h3 className="font-display text-xl text-[var(--primary)] mb-3">Salud Ósea</h3>
                        <p className="text-sm">Protección a largo plazo para tus huesos.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
