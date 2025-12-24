"use client";

import { useTranslations } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    const t = useTranslations('Faqs');

    const faqKeys = [
        'what_is_trh',
        'is_bioidentical',
        'benefits',
        'cancer_history',
        'procedure',
        'why_labs'
    ] as const;

    return (
        <section id="faq" className="py-25 bg-accent/5">
            <div className="container px-4 mx-auto max-w-5xl">
                {/* Cabecera optimizada */}
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                        {t('title')}
                    </h2>
                    <div className="h-1 w-20 bg-primary mx-auto mb-8" />
                    <p className="text-foreground/70 font-sans italic max-w-2xl mx-auto text-lg">
                        {t('description')}
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqKeys.map((key) => (
                        <AccordionItem
                            key={key}
                            value={key}
                            className="border border-primary/10 rounded-xl bg-white/40 px-6 overflow-hidden transition-colors hover:bg-white/60"
                        >
                            <AccordionTrigger className="font-display text-xl text-primary hover:no-underline text-left py-6">
                                {t(`items.${key}.question`)}
                            </AccordionTrigger>

                            <AccordionContent className="overflow-hidden">
                                <div className="pb-6 pt-2 pl-6 border-l-2 border-accent/40 ml-1">
                                    <p className="text-foreground/80 text-lg leading-relaxed">
                                        {t(`items.${key}.answer`)}
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}