import Link from "next/link";
import { requireAdmin } from "@/server/lib/require-admin";
import { CATEGORIES } from "@/server/modules/products/product.model";
import { ProductForm } from "../product-form";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
    await requireAdmin();

    return (
        <section>
            <Link href="/admin/products" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                Back to products
            </Link>
            <h1 className="mt-4 font-display text-4xl tracking-tight">New product</h1>
            <ProductForm categories={[...CATEGORIES]} />
        </section>
    );
}