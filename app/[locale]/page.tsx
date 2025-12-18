import Hero from '@/components/landing/Hero';
import Bio from '@/components/landing/Bio';
import TRHInfo from '@/components/landing/TRHInfo';
import FAQ from '@/components/landing/FAQ';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Bio />
      <TRHInfo />
      <FAQ />
      <section className="py-20 text-center text-muted-foreground">
        <p>Más secciones (Bio, TRH, FAQ) en desarrollo...</p>
      </section>
    </main>
  );
}
