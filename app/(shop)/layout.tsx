import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { TestModeBanner } from "@/components/shop/test-mode-banner";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TestModeBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}