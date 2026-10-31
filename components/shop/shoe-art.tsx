import { Contours } from "@/components/ui/contours";

const BACKGROUNDS = ["#dce4e4", "#e3e6ea", "#e6e4dd", "#d9e3dd", "#e8e0da", "#dde2e8"];

function hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

export function ShoeArt({ seed, svgClassName = "w-4/5" }: { seed: string; svgClassName?: string }) {
    const bg = BACKGROUNDS[hash(seed) % BACKGROUNDS.length];

    return (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center" style={{ background: bg }}>
            <Contours className="absolute inset-0 h-full w-full text-ink opacity-[0.12]" />
            <svg viewBox="0 0 400 240" className={`relative ${svgClassName}`}>
                <path
                    d="M52 156 C52 120 60 90 70 66 C74 56 84 52 94 56 L130 70 C150 78 170 70 184 58 C196 48 212 50 224 60 C262 92 330 112 360 140 C372 150 376 156 368 156 Z"
                    className="fill-ink"
                />
                <path
                    d="M30 170 C30 160 40 156 52 156 L350 156 C372 156 384 166 384 180 C384 190 376 196 364 196 L52 196 C38 196 30 188 30 170 Z"
                    className="fill-paper"
                />
                <path d="M120 142 C180 126 250 130 330 148" className="fill-none stroke-accent" strokeWidth="7" strokeLinecap="round" />
                <g className="stroke-paper" strokeWidth="4" strokeLinecap="round" opacity="0.7">
                    <path d="M138 76 L152 94" />
                    <path d="M162 74 L176 92" />
                    <path d="M188 72 L202 90" />
                </g>
            </svg>
        </div>
    );
}