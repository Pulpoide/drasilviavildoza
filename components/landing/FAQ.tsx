export default function FAQ() {
    const faqs = [
        {
            q: "¿Qué es la TRH Bioidéntica?",
            a: "Es una terapia que utiliza hormonas con una estructura molecular idéntica a las que produce tu cuerpo, logrando un balance natural sin los riesgos de las hormonas sintéticas tradicionales."
        },
        {
            q: "¿Para quién es este tratamiento?",
            a: "Mujeres en perimenopausia, menopausia o con desequilibrios hormonales que buscan recuperar su energía, mejorar su sueño, libido y bienestar general."
        },
        {
            q: "¿Cómo es el proceso de consulta?",
            a: "Iniciamos con una evaluación integral de tu historia clínica y laboratorios. Si eres candidata, diseñamos un plan a medida y te acompañamos en el seguimiento."
        }
    ];

    return (
        <section className="py-20 bg-[var(--background)]">
            <div className="container px-4 mx-auto max-w-3xl">
                <h2 className="font-display text-3xl md:text-4xl text-[var(--foreground)] mb-12 text-center">
                    Preguntas Frecuentes
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 border border-[var(--border)] rounded-[var(--radius)]">
                            <h3 className="font-display text-lg text-[var(--primary)] mb-2">{faq.q}</h3>
                            <p className="text-[var(--foreground)]/80 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
