import { connectDB } from "@/server/lib/db";
import { Product, type Category } from "./product.model";

export type ProductDTO = {
    id: string;
    slug: string;
    name: string;
    category: Category;
    description: string;
    priceCents: number;
    currency: string;
    images: string[];
};

export async function listProducts(filter: { category?: Category } = {}): Promise<ProductDTO[]> {
    await connectDB();
    const docs = await Product.find({
        isActive: true,
        ...(filter.category ? { category: filter.category } : {}),
    })
        .sort({ createdAt: -1 })
        .lean();

    return docs.map((d) => ({
        id: String(d._id),
        slug: d.slug,
        name: d.name,
        category: d.category as Category,
        description: d.description,
        priceCents: d.priceCents,
        currency: d.currency,
        images: d.images,
    }));
}