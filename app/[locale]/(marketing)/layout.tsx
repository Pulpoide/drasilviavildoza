// app/[locale]/(marketing)/layout.tsx
import Navbar from "@/components/layout/Navbar"; // Verifica que la ruta sea correcta
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}