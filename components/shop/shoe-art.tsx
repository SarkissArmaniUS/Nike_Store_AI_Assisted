const PALETTES: [string, string][] = [
    ["#e8dfd0", "#cdbfa8"], // sand
    ["#d8dde0", "#aab4bb"], // slate
    ["#ecd9cf", "#d9a58c"], // clay
    ["#dfe3d6", "#b4bd9f"], // moss
    ["#e6d6d0", "#c9806a"], // ember
    ["#dcdad6", "#9a968e"], // stone
];

function hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

export function ShoeArt({ seed, svgClassName = "w-4/5" }: { seed: string; svgClassName?: string }) {
    const [from, to] = PALETTES[hash(seed) % PALETTES.length];

    return (
        <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
        >
            <svg
                viewBox="0 0 400 240"
                className={`${svgClassName} drop-shadow-[0_18px_24px_rgba(20,20,20,0.18)] transition-transform duration-500 group-hover:scale-105`}
            >
                {/* верх */}
                <path
                    d="M52 156 C52 120 60 90 70 66 C74 56 84 52 94 56 L130 70 C150 78 170 70 184 58 C196 48 212 50 224 60 C262 92 330 112 360 140 C372 150 376 156 368 156 Z"
                    fill="#141414"
                />
                {/* підошва */}
                <path
                    d="M30 170 C30 160 40 156 52 156 L350 156 C372 156 384 166 384 180 C384 190 376 196 364 196 L52 196 C38 196 30 188 30 170 Z"
                    fill="#f4f1ea"
                />
                {/* акцент */}
                <path d="M120 142 C180 126 250 130 330 148" stroke="#d9461f" strokeWidth="7" strokeLinecap="round" fill="none" />
                {/* шнурівка */}
                <g stroke="#f4f1ea" strokeWidth="4" strokeLinecap="round" opacity="0.7">
                    <path d="M138 76 L152 94" />
                    <path d="M162 74 L176 92" />
                    <path d="M188 72 L202 90" />
                </g>
            </svg>
        </div>
    );
}