"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/components/cart/use-cart";

export function CartLink() {
    const { count } = useCart();
    const reduce = useReducedMotion();

    return (
        <Link href="/cart" className="text-sm transition-colors hover:text-accent">
            Cart (
            <motion.span
                key={count}
                className="inline-block"
                initial={reduce ? false : { y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
            >
                {count}
            </motion.span>
            )
        </Link>
    );
}

// "use client";
//
// import Link from "next/link";
// import { useCart } from "@/components/cart/use-cart";
//
// export function CartLink() {
//     const { count } = useCart();
//     return (
//         <Link href="/cart" className="text-sm transition-colors hover:text-accent">
//             Cart ({count})
//         </Link>
//     );
// }