"use client";

import { useState } from "react";

type Variant = { sku: string; size: number; stock: number };

export function SizeSelector({ variants }: { variants: Variant[] }) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Select size (EU)</p>
            <div className="grid grid-cols-5 gap-2">
                {variants.map((v) => (
                    <button
                        key={v.sku}
                        type="button"
                        disabled={v.stock === 0}
                        onClick={() => setSelected(v.sku)}
                        aria-pressed={selected === v.sku}
                        className={`border py-3 text-sm transition-colors disabled:cursor-not-allowed disabled:text-line disabled:line-through ${
                            selected === v.sku ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                        }`}
                    >
                        {v.size}
                    </button>
                ))}
            </div>

            <button
                type="button"
                disabled={!selected}
                className="mt-8 w-full bg-ink py-4 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
                {selected ? "Add to cart" : "Select a size"}
            </button>
        </div>
    );
}