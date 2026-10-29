import { CartView } from "@/components/cart/cart-view";

export const metadata = { title: "Cart" };

export default function CartPage() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">Cart</h1>
            <CartView />
        </section>
    );
}