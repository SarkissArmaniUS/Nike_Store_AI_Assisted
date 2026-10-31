"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/server/lib/require-admin";
import { cancelPendingOrder, markOrderShipped } from "@/server/modules/orders/order.service";

const idSchema = z.string().regex(/^[a-f\d]{24}$/i);

export async function shipOrderAction(formData: FormData) {
    await requireAdmin(); // серверні дії це публічні ендпоінти, тому перевіряємо роль і тут
    const id = idSchema.safeParse(formData.get("orderId"));
    if (!id.success) return;
    await markOrderShipped(id.data);
    revalidatePath("/admin", "layout");
}

export async function cancelOrderAction(formData: FormData) {
    await requireAdmin();
    const id = idSchema.safeParse(formData.get("orderId"));
    if (!id.success) return;
    await cancelPendingOrder(id.data); // скасовує лише pending і повертає склад
    revalidatePath("/admin", "layout");
}