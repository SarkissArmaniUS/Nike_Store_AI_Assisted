"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Contours } from "@/components/ui/contours";

const LINES = ["Built for", "the long way", "home."];
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 60, damping: 20, mass: 0.8 };

export function RouteHero() {
    const reduce = useReducedMotion();

    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const x = useSpring(useTransform(px, [-1, 1], [-28, 28]), SPRING);
    const y = useSpring(useTransform(py, [-1, 1], [-18, 18]), SPRING);
    const rotate = useSpring(useTransform(px, [-1, 1], [-3, 3]), SPRING);

    function onPointerMove(e: React.PointerEvent<HTMLElement>) {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
    }

    function onPointerLeave() {
        px.set(0);
        py.set(0);
    }

    return (
        <section className="relative overflow-hidden" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-24 top-0 hidden w-[60%] max-w-3xl text-ink opacity-[0.09] md:block"
                style={{ x, y, rotate }}
            >
                <Contours className="h-auto w-full" />
            </motion.div>

            <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
                <h1 className="font-display text-[clamp(3.5rem,13vw,10rem)] leading-[0.88]">
                    {LINES.map((line, i) => (
                        <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
                    ))}
                </h1>

                <p className="mt-8 max-w-md text-lg text-muted">
                    Running and everyday shoes for people who take the scenic route.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link
                        href="/products"
                        className="bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent hover:text-ink"
                    >
                        Shop the collection
                    </Link>
                    <Link href="/products?category=running" className="text-sm underline underline-offset-4">
                        Shop running
                    </Link>
                </div>

                <svg viewBox="0 0 1200 140" className="mt-14 h-auto w-full" fill="none" aria-hidden>
                    <motion.path
                        d="M4 112 C 150 112, 210 28, 380 48 S 620 130, 780 84 S 980 14, 1130 62"
                        className="stroke-accent"
                        strokeWidth="3"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                    />
                    <circle cx="4" cy="112" r="5" className="fill-ink" />
                    <motion.circle
                        cx="1130"
                        cy="62"
                        r="8"
                        className="fill-ink"
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2.2, duration: 0.3 }}
                    />
                </svg>
            </div>
        </section>
    );
}