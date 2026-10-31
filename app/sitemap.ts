import type { MetadataRoute } from "next";
import { listProducts } from "@/server/modules/products/product.service";

export const revalidate = 3600;

const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pages: MetadataRoute.Sitemap = [
        { url: base, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
    ];

    try {
        const products = await listProducts();
        return [
            ...pages,
            ...products.map((p) => ({
                url: `${base}/products/${p.slug}`,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            })),
        ];
    } catch (e) {
        console.error("Sitemap: could not load products", e);
        return pages;
    }
}