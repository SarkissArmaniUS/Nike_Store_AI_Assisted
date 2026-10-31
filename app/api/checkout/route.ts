import { NextResponse } from "next/server";
import { z } from "zod";
import { CheckoutError } from "@/server/modules/orders/order.service";
import { createCheckoutSession } from "@/server/modules/payments/checkout.service";
import { auth } from "@/server/lib/auth";

export const runtime = "nodejs";

const bodySchema = z.object({
    items: z
        .array(z.object({ sku: z.string().min(1).max(64), qty: z.number().int().min(1).max(10) }))
        .min(1)
        .max(20),
});

export async function POST(req: Request) {
    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }

    const merged = new Map<string, number>();
    for (const { sku, qty } of parsed.data.items) merged.set(sku, (merged.get(sku) ?? 0) + qty);
    const lines = [...merged].map(([sku, qty]) => ({ sku, qty: Math.min(qty, 10) }));

    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const url = await createCheckoutSession(lines, session?.user.id, session?.user.email);
        // const url = await createCheckoutSession(lines);
        return NextResponse.json({ url });
    } catch (e) {
        if (e instanceof CheckoutError) {
            return NextResponse.json({ error: e.message }, { status: e.status });
        }
        console.error("Checkout failed", e);
        return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }
}