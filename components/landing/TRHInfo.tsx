import { useTranslations } from 'next-intl';
import { Zap, Moon, Heart, ShieldCheck } from 'lucide-react';

export default function TRHInfo() {
    const t = useTranslations('TRHInfo');

    const benefits = [
        { key: 'energy', icon: <Zap className="text-primary" size={24} /> },
        { key: 'rest', icon: <Moon className="text-primary" size={24} /> },
        { key: 'intimacy', icon: <Heart className="text-primary" size={24} /> },
        { key: 'protection', icon: <ShieldCheck className="text-primary" size={24} /> },
    ];

    return (
        <section id="trh" className="w-full py-35 bg-accent/8">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
                        {t('title')}
                    </h2>
                    <div className="h-1 w-24 bg-primary mx-auto mb-8" />
                    <p className="text-lg text-[var(--foreground)]/80 font-sans leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.key}
                            className="p-8 bg-white border border-primary/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                        >
                            <div className="mb-6 bg-primary/5 w-12 h-12 flex items-center justify-center rounded-full group-hover:bg-primary/10 transition-colors">
                                {benefit.icon}
                            </div>
                            <h3 className="font-display text-xl text-[var(--primary)] mb-3">
                                {t(`benefits.${benefit.key}.title`)}
                            </h3>
                            <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
                                {t(`benefits.${benefit.key}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}