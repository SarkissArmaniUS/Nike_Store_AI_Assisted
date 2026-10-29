import Link from "next/link";

export default function HomePage() {
    return (
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-28">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Autumn / Winter 2026</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
                Built for the <em className="text-accent">long way</em> home.
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                    href="/products"
                    className="bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent"
                >
                    Shop the collection
                </Link>
                <Link href="/products?category=running" className="text-sm underline underline-offset-4">
                    Explore running
                </Link>
            </div>
            {/* Заміниш на next/image, коли з'явиться фото в public/ */}
            <div className="mt-16 aspect-[16/9] w-full bg-paper-2" />
        </section>
    );
}