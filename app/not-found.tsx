import Link from "next/link";
import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="mx-auto max-w-7xl px-6 py-32">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Error 404</p>
                    <h1 className="mt-4 font-display text-6xl tracking-tight md:text-8xl">
                        Wrong <em className="text-accent">turn.</em>
                    </h1>
                    <p className="mt-6 max-w-md text-muted">
                        The page you are looking for does not exist or has moved.
                    </p>
                    <Link
                        href="/products"
                        className="mt-10 inline-block bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent"
                    >
                        Back to the shop
                    </Link>
                </section>
            </main>
            <Footer />
        </>
    );
}