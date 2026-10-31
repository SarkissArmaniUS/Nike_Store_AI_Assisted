"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/use-cart";

type Variant = { sku: string; size: number; stock: number };
type Props = {
    product: { slug: string; name: string; priceCents: number; currency: string; image?: string };
    variants: Variant[];
};

export function SizeSelector({ product, variants }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    const variant = variants.find((v) => v.sku === selected);

    function handleAdd() {
        if (!variant) return;
        addItem({
            sku: variant.sku,
            slug: product.slug,
            name: product.name,
            size: variant.size,
            priceCents: product.priceCents,
            currency: product.currency,
            image: product.image,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    }

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
                disabled={!variant}
                onClick={handleAdd}
                className="mt-8 w-full bg-ink py-4 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            >
                {added ? "Added to cart" : variant ? "Add to cart" : "Select a size"}
            </button>
        </div>
    );
}