"use client";

import Link from "next/link";
import { useCart } from "./use-cart";
import { MAX_QTY } from "./cart-store";
import { formatPrice } from "@/components/shop/product-card";

export function CartView() {
    const { items, subtotalCents, setQty, removeItem } = useCart();

    if (items.length === 0) {
        return (
            <div className="mt-12">
                <p className="text-muted">Your cart is empty.</p>
                <Link href="/products" className="mt-6 inline-block underline underline-offset-4">
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-12 grid gap-16 md:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-line border-y border-line">
                {items.map((item) => (
                    <li key={item.sku} className="flex gap-6 py-6">
                        <div className="aspect-[4/5] w-24 shrink-0 bg-paper-2" />
                        <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Link href={`/products/${item.slug}`} className="font-display text-2xl tracking-tight hover:text-accent">
                                        {item.name}
                                    </Link>
                                    <p className="mt-1 text-sm text-muted">Size EU {item.size}</p>
                                </div>
                                <p className="text-sm">{formatPrice(item.priceCents * item.qty, item.currency)}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center border border-line text-sm">
                                    <button
                                        type="button"
                                        aria-label={`Decrease quantity of ${item.name}`}
                                        onClick={() => setQty(item.sku, item.qty - 1)}
                                        className="px-3 py-2 hover:bg-paper-2"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-8 text-center" aria-live="polite">{item.qty}</span>
                                    <button
                                        type="button"
                                        aria-label={`Increase quantity of ${item.name}`}
                                        disabled={item.qty >= MAX_QTY}
                                        onClick={() => setQty(item.sku, item.qty + 1)}
                                        className="px-3 py-2 hover:bg-paper-2 disabled:text-line"
                                    >
                                        +
                                    </button>
                                </div>
                                <button type="button" onClick={() => removeItem(item.sku)} className="text-sm text-muted underline underline-offset-4 hover:text-accent">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <aside className="h-fit border border-line p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Summary</p>
                <div className="mt-6 flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotalCents, items[0].currency)}</span>
                </div>
                <p className="mt-2 text-xs text-muted">Shipping and taxes are calculated at checkout.</p>
                <button
                    type="button"
                    disabled
                    className="mt-6 w-full bg-ink py-4 text-sm text-paper disabled:bg-line disabled:text-muted"
                >
                    Checkout (next step)
                </button>
            </aside>
        </div>
    );
}