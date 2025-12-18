export default function Bio() {
    return (
        <section className="py-20 bg-[var(--background)]">
            <div className="container px-4 mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[500px] w-full bg-[var(--muted)] rounded-[var(--radius)] overflow-hidden">
                    {/* Placeholder for Dr. Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
                        [Imagen Dra. Silvia Vildoza]
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="font-display text-4xl text-[var(--foreground)]">Trayectoria y Superación</h2>
                    <p className="text-[var(--foreground)]/80 leading-relaxed font-sans">
                        Soy la Dra. Silvia Vildoza. Mi camino en la medicina no solo ha sido académico, sino profundamente personal.
                        Como sobreviviente de cáncer, entiendo lo que significa luchar por recuperar la vitalidad y el equilibrio.
                    </p>
                    <p className="text-[var(--foreground)]/80 leading-relaxed font-sans">
                        Dedico mi práctica a ayudar a otras mujeres a transitar cambios hormonales con ciencia, empatía y una visión integral de la salud.
                    </p>
                </div>
            </div>
        </section>
    )
}
