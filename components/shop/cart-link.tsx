"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/use-cart";

export function CartLink() {
    const { count } = useCart();
    return (
        <Link href="/cart" className="text-sm transition-colors hover:text-accent">
            Cart ({count})
        </Link>
    );
}