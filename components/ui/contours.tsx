export function Contours({ className }: { className?: string }) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            {Array.from({ length: 14 }).map((_, i) => (
                <ellipse
                    key={i}
                    cx="520"
                    cy="300"
                    rx={40 + i * 28}
                    ry={24 + i * 20}
                    transform={`rotate(${-18 + i * 1.6} 520 300)`}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            ))}
        </svg>
    );
}