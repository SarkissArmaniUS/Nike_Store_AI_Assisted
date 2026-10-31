"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/server/lib/require-admin";
import { createProduct, deleteProduct, setProductActive } from "@/server/modules/products/product.admin";
import { productFormSchema } from "@/server/modules/products/product.schema";

export type FormState = { error?: string; values?: Record<string, string> } | undefined;

const idSchema = z.string().regex(/^[a-f\d]{24}$/i);

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
    await requireAdmin(); // серверні дії це публічні ендпоінти, тому роль перевіряємо в кожній

    const values = Object.fromEntries(
        [...formData].filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );

    const parsed = productFormSchema.safeParse(values);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Invalid data", values };
    }

    try {
        await createProduct(parsed.data);
    } catch (e) {
        if ((e as { code?: number }).code === 11000) {
            return { error: "A product with this slug already exists.", values };
        }
        console.error("Create product failed", e);
        return { error: "Could not create the product. Please try again.", values };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    redirect("/admin/products?notice=created"); // redirect кидає виняток, тому стоїть поза try/catch
}

export async function toggleProductAction(formData: FormData) {
    await requireAdmin();
    const id = idSchema.safeParse(formData.get("productId"));
    const active = z.enum(["0", "1"]).safeParse(formData.get("active"));
    if (!id.success || !active.success) return;

    await setProductActive(id.data, active.data === "1");
    revalidatePath("/admin/products");
    revalidatePath("/products");
}

export async function deleteProductAction(formData: FormData) {
    await requireAdmin();
    const id = idSchema.safeParse(formData.get("productId"));
    if (!id.success) return;

    const result = await deleteProduct(id.data);
    revalidatePath("/admin/products");
    revalidatePath("/products");

    const notice =
        result === "deleted" ? "deleted" : result === "has_pending_orders" ? "has-pending-orders" : "not-found";
    redirect(`/admin/products?notice=${notice}`);
}