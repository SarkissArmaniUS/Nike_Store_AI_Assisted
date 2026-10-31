"use client";

import { useEffect } from "react";
import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="mx-auto max-w-7xl px-6 py-32">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Something went wrong</p>
                    <h1 className="mt-4 font-display text-6xl tracking-tight md:text-8xl">
                        We tripped <em className="text-accent">up.</em>
                    </h1>
                    <p className="mt-6 max-w-md text-muted">
                        An unexpected error occurred. Please try again in a moment.
                    </p>
                    {error.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
                    <button
                        type="button"
                        onClick={reset}
                        className="mt-10 bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent"
                    >
                        Try again
                    </button>
                </section>
            </main>
            <Footer />
        </>
    );
}