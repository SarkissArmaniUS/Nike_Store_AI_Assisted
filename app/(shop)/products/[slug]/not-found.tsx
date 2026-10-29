import Link from "next/link";

export default function NotFound() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-32">
            <h1 className="font-display text-5xl tracking-tight">Product not found</h1>
            <Link href="/products" className="mt-6 inline-block underline underline-offset-4">
                Back to shop
            </Link>
        </section>
    );
}