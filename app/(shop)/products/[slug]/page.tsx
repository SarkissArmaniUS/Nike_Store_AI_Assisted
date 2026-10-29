import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice } from "@/components/shop/product-card";
import { SizeSelector } from "@/components/shop/size-selector";
import { getProductBySlug } from "@/server/modules/products/product.service";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return {};

    return {
        title: product.name,
        description: product.description,
        openGraph: { title: product.name, description: product.description, images: product.images },
    };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const inStock = product.variants.some((v) => v.stock > 0);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        sku: product.variants[0]?.sku,
        brand: { "@type": "Brand", name: "Northline" },
        offers: {
            "@type": "Offer",
            price: (product.priceCents / 100).toFixed(2),
            priceCurrency: product.currency.toUpperCase(),
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    };

    return (
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />

            {/* Заміниш на next/image, коли з'являться фото */}
            <div className="aspect-[4/5] w-full bg-paper-2" />

            <div className="md:pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.category}</p>
                <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">{product.name}</h1>
                <p className="mt-4 text-lg">{formatPrice(product.priceCents, product.currency)}</p>
                <p className="mt-6 max-w-md text-muted">{product.description}</p>

                <div className="mt-10">
                    <SizeSelector
                        product={{
                            slug: product.slug,
                            name: product.name,
                            priceCents: product.priceCents,
                            currency: product.currency,
                        }}
                        variants={product.variants}
                    />
                </div>
            </div>
        </section>
    );
}