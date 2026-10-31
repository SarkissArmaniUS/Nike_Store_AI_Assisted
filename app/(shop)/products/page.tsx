import Link from "next/link";
import { z } from "zod";
import { ProductCard } from "@/components/shop/product-card";
import { CATEGORIES } from "@/server/modules/products/product.model";
import { listProducts } from "@/server/modules/products/product.service";

export const metadata = { title: "Shop" };

const categorySchema = z.enum(CATEGORIES).optional().catch(undefined);

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
    const sp = await searchParams;
    const category = categorySchema.parse(sp.category);
    const products = await listProducts({ category });

    const tabs = [{ label: "All", value: undefined }, ...CATEGORIES.map((c) => ({ label: c, value: c }))];

    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <h1 className="font-display text-6xl md:text-8xl">Shop</h1>

            <nav className="mt-8 flex gap-6 border-b border-line pb-4 text-sm capitalize">
                {tabs.map((t) => (
                    <Link
                        key={t.label}
                        href={t.value ? `/products?category=${t.value}` : "/products"}
                        className={
                            t.value === category
                                ? "text-ink underline decoration-accent decoration-2 underline-offset-8"
                                : "text-muted hover:text-ink"
                        }
                    >
                        {t.label}
                    </Link>
                ))}
            </nav>

            {products.length === 0 ? (
                <p className="mt-16 text-muted">No products found.</p>
            ) : (
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </section>
    );
}