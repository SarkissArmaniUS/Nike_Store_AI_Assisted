"use client";

import { motion, useReducedMotion } from "framer-motion";

const W = 1200;
const H = 440;
const PATH = "M40 380 C 200 380, 250 190, 430 215 S 620 360, 790 270 S 990 70, 1160 110";
const DRAW_DELAY = 0.6;
const DRAW_TIME = 2.4;

// `at` це приблизна частка довжини шляху, на якій лежить точка.
const MARKS = [
    { name: "Trailhead", km: "0 km", x: 40, y: 380, at: 0, pos: "bottom-full mb-2 left-0" },
    { name: "Cairn", km: "9 km", x: 430, y: 215, at: 0.36, pos: "bottom-full mb-2 left-1/2 -translate-x-1/2" },
    { name: "Ridge", km: "16 km", x: 790, y: 270, at: 0.67, pos: "top-full mt-2 left-1/2 -translate-x-1/2" },
    { name: "Home", km: "24 km", x: 1160, y: 110, at: 1, pos: "bottom-full mb-2 right-0 text-right" },
];

// Замкнена нерівна лінія навколо центру. Без випадковості, тому сервер і браузер дають однаковий результат.
function blob(cx: number, cy: number, rx: number, ry: number, seed: number) {
    const points = Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2;
        const wobble = 1 + 0.07 * Math.sin(3 * a + seed) + 0.04 * Math.sin(5 * a + seed * 2.1);
        return `${(cx + Math.cos(a) * rx * wobble).toFixed(1)} ${(cy + Math.sin(a) * ry * wobble).toFixed(1)}`;
    });
    return `M${points.join("L")}Z`;
}

const HILLS = [
    { cx: 290, cy: 140, seed: 1 },
    { cx: 1000, cy: 150, seed: 2.5 },
];
const LEVELS = 7;

const CONTOURS = HILLS.flatMap((h) =>
    Array.from({ length: LEVELS }, (_, k) => ({
        d: blob(h.cx, h.cy, 36 + k * 40, 24 + k * 27, h.seed + k * 0.15),
        major: k % 3 === 2,
    })),
);

const LAKE = blob(700, 398, 78, 20, 4);
// Основна течія: від джерела вгорі через долину до озера, перетинає маршрут біля x≈650
const RIVER = "M600 -10 C 650 20, 660 60, 620 95 S 560 150, 610 190 S 680 230, 640 265 S 640 315, 690 345 S 705 365, 700 380";
// Витік з озера, звивається вправо
const OUTFLOW = "M772 398 C 840 372, 900 428, 980 404 S 1100 372, 1200 400";
// Притока від правої гори
const TRIBUTARY = "M965 262 C 930 300, 890 300, 870 340 S 840 372, 850 392";

const GRID_X = Array.from({ length: W / 100 - 1 }, (_, i) => (i + 1) * 100);
const GRID_Y = Array.from({ length: 4 }, (_, i) => (i + 1) * 88);

export function RouteMap() {
    const reduce = useReducedMotion();

    return (
        <div
            role="img"
            aria-label="Illustrated topographic map of a route from the trailhead to home"
            className="relative mt-14 aspect-[1200/440] w-full overflow-hidden border border-line bg-paper-2/40"
        >
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
                {GRID_X.map((x) => (
                    <path key={`x${x}`} d={`M${x} 0V${H}`} className="stroke-line/60" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
                {GRID_Y.map((y) => (
                    <path key={`y${y}`} d={`M0 ${y}H${W}`} className="stroke-line/60" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}

                <path d={LAKE} className="fill-[#d6e3e8] stroke-ink/25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d={RIVER} className="stroke-[#a9c3cd]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <path d={OUTFLOW} className="stroke-[#a9c3cd]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <path d={TRIBUTARY} className="stroke-[#b9ced6]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

                {CONTOURS.map((c, i) => (
                    <path
                        key={i}
                        d={c.d}
                        className={c.major ? "stroke-ink/30" : "stroke-ink/15"}
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                <path
                    d={PATH}
                    className="stroke-ink/30"
                    strokeWidth="2"
                    strokeDasharray="2 8"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
                {/* Без vectorEffect: разом з анімацією довжини він дає недомальований кінець лінії */}
                <motion.path
                    d={PATH}
                    className="stroke-accent"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: DRAW_TIME, delay: DRAW_DELAY, ease: "linear" }}
                />
            </svg>

            <div aria-hidden className="absolute left-3 top-3 flex flex-col items-center gap-1 text-xs text-muted">
                <span>N</span>
                <span className="h-6 w-px bg-ink/60" />
            </div>
            <div aria-hidden className="absolute bottom-3 right-3 flex flex-col items-end gap-1 text-xs text-muted">
                <span>5 km</span>
                <span className="h-px w-16 bg-ink/60" />
            </div>

            {MARKS.map((m) => (
                <div
                    key={m.name}
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(m.x / W) * 100}%`, top: `${(m.y / H) * 100}%` }}
                >
                    <motion.div
                        className="relative h-full w-full"
                        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: DRAW_DELAY + m.at * DRAW_TIME, duration: 0.3 }}
                    >
                        <span
                            className={`block h-3 w-3 rounded-full bg-ink ${m.name === "Home" ? "ring-4 ring-accent/40" : ""}`}
                        />
                        <span className={`absolute whitespace-nowrap text-xs leading-tight ${m.pos}`}>
                            <span className="block font-medium">{m.name}</span>
                            <span className="hidden text-muted sm:block">{m.km}</span>
                        </span>
                    </motion.div>
                </div>
            ))}
        </div>
    );
}