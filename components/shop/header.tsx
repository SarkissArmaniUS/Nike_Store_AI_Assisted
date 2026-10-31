"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AccountLink } from "./account-link";
import { CartLink } from "./cart-link";

const links = [
    { href: "/products", label: "Shop" },
    { href: "/products?category=running", label: "Running" },
    { href: "/products?category=lifestyle", label: "Lifestyle" },
];

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <MotionConfig reducedMotion="user">
            <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" onClick={() => setOpen(false)} className="font-display text-3xl">
                        Northline
                    </Link>

                    <nav aria-label="Main" className="hidden gap-8 text-sm md:flex">
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-5">
                        <AccountLink />
                        <CartLink />
                        <button
                            type="button"
                            className="text-sm md:hidden"
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            onClick={() => setOpen((o) => !o)}
                        >
                            {open ? "Close" : "Menu"}
                        </button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.nav
                            id="mobile-nav"
                            aria-label="Mobile"
                            className="overflow-hidden border-t border-line md:hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <ul className="mx-auto max-w-7xl px-6 py-4">
                                {links.map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            onClick={() => setOpen(false)}
                                            className="block py-3 font-display text-4xl"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>
        </MotionConfig>
    );
}

// "use client";
//
// import Link from "next/link";
// import { useState } from "react";
// import { AccountLink } from "./account-link";
// import { CartLink } from "./cart-link";
//
// const links = [
//     { href: "/products", label: "Shop" },
//     { href: "/products?category=running", label: "Running" },
//     { href: "/products?category=lifestyle", label: "Lifestyle" },
// ];
//
// export function Header() {
//     const [open, setOpen] = useState(false);
//
//     return (
//         <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
//             <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
//                 <Link href="/" onClick={() => setOpen(false)} className="font-display text-2xl tracking-tight">
//                     Northline
//                 </Link>
//
//                 <nav aria-label="Main" className="hidden gap-8 text-sm md:flex">
//                     {links.map((l) => (
//                         <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">
//                             {l.label}
//                         </Link>
//                     ))}
//                 </nav>
//
//                 <div className="flex items-center gap-5">
//                     <AccountLink />
//                     <CartLink />
//                     <button
//                         type="button"
//                         className="text-sm md:hidden"
//                         aria-expanded={open}
//                         aria-controls="mobile-nav"
//                         onClick={() => setOpen((o) => !o)}
//                     >
//                         {open ? "Close" : "Menu"}
//                     </button>
//                 </div>
//             </div>
//
//             {open && (
//                 <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line md:hidden">
//                     <ul className="mx-auto max-w-7xl px-6 py-4">
//                         {links.map((l) => (
//                             <li key={l.href}>
//                                 <Link
//                                     href={l.href}
//                                     onClick={() => setOpen(false)}
//                                     className="block py-3 font-display text-3xl tracking-tight"
//                                 >
//                                     {l.label}
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>
//             )}
//         </header>
//     );
// }