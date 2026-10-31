import { connectDB } from "../../lib/db";
import { Order } from "../orders/order.model";
import { Product, type Category } from "./product.model";
import type { ProductFormData } from "./product.schema";

export type AdminProduct = {
    id: string;
    slug: string;
    name: string;
    category: Category;
    priceCents: number;
    currency: string;
    isActive: boolean;
    variants: { sku: string; size: number; stock: number }[];
    totalStock: number;
};

export async function listProductsAdmin(): Promise<AdminProduct[]> {
    await connectDB();
    const docs = await Product.find({}).sort({ createdAt: -1 }).lean();

    return docs.map((d) => ({
        id: String(d._id),
        slug: d.slug,
        name: d.name,
        category: d.category as Category,
        priceCents: d.priceCents,
        currency: d.currency,
        isActive: d.isActive,
        variants: d.variants.map((v) => ({ sku: v.sku, size: v.size, stock: v.stock })),
        totalStock: d.variants.reduce((sum, v) => sum + v.stock, 0),
    }));
}

export async function createProduct(input: ProductFormData) {
    await connectDB();
    await Product.create({
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        priceCents: input.priceCents,
        currency: "usd",
        images: input.image ? [input.image] : [],
        // SKU будується зі slug, який унікальний, тому SKU теж унікальні
        variants: input.sizes.map((size) => ({
            sku: `${input.slug}-${size}`.toUpperCase(),
            color: input.color,
            size,
            stock: input.stock,
        })),
        isActive: true,
    });
}

export async function setProductActive(id: string, active: boolean) {
    await connectDB();
    await Product.updateOne({ _id: id }, { isActive: active });
}

export type DeleteResult = "deleted" | "not_found" | "has_pending_orders";

export async function deleteProduct(id: string): Promise<DeleteResult> {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return "not_found";

    // Не видаляємо, поки хтось може оплачувати це замовлення в Stripe
    const pending = await Order.countDocuments({ status: "pending", "items.slug": product.slug });
    if (pending > 0) return "has_pending_orders";

    await Product.deleteOne({ _id: id });
    return "deleted";
}