import Link from "next/link";
import { ClearCart } from "@/components/cart/clear-cart";

export const metadata = { title: "Order received" };

export default function SuccessPage() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-32">
            <ClearCart />
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Thank you</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">Order received</h1>
            <p className="mt-6 max-w-md text-muted">
                We are confirming your payment. This usually takes a few seconds.
            </p>
            <Link href="/products" className="mt-10 inline-block underline underline-offset-4">
                Continue shopping
            </Link>
        </section>
    );
}