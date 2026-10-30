import Link from "next/link";
import type { ProductDTO } from "@/server/modules/products/product.service";
import { ProductImage } from "./product-image";

export function formatPrice(cents: number, currency = "usd") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function ProductCard({ product }: { product: ProductDTO }) {
    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <ProductImage
                src={product.images[0]}
                alt={product.name}
                slug={product.slug}
                sizes="(min-width: 768px) 33vw, 50vw"
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl tracking-tight">{product.name}</h3>
                <p className="text-sm">{formatPrice(product.priceCents, product.currency)}</p>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{product.category}</p>
        </Link>
    );
}

// import Link from "next/link";
// import type { ProductDTO } from "@/server/modules/products/product.service";
//
// export function formatPrice(cents: number, currency = "usd") {
//     return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
// }
//
// export function ProductCard({ product }: { product: ProductDTO }) {
//     return (
//         <Link href={`/products/${product.slug}`} className="group block">
//             <div className="aspect-[4/5] w-full bg-paper-2 transition-colors group-hover:bg-line" />
//             <div className="mt-4 flex items-baseline justify-between gap-4">
//                 <h3 className="font-display text-2xl tracking-tight">{product.name}</h3>
//                 <p className="text-sm">{formatPrice(product.priceCents, product.currency)}</p>
//             </div>
//             <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{product.category}</p>
//         </Link>
//     );
// }