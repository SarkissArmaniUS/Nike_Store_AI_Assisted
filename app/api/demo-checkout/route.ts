import { NextResponse } from "next/server";
import { auth } from "@/server/lib/auth";
import { rateLimit } from "@/server/lib/rate-limit";
import { createCheckoutSession } from "@/server/modules/payments/checkout.service";
import { findDemoSku } from "@/server/modules/products/product.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
    // 303 перетворює POST на GET, тож браузер без проблем переходить за адресою
    const redirectTo = (target: string) => NextResponse.redirect(new URL(target, req.url), 303);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const limit = await rateLimit(`demo:${ip}`, 5, 60_000);
    if (!limit.ok) return redirectTo("/products");

    try {
        const sku = await findDemoSku();
        if (!sku) return redirectTo("/products");

        const session = await auth.api.getSession({ headers: req.headers });
        const url = await createCheckoutSession([{ sku, qty: 1 }], session?.user.id, session?.user.email);
        return NextResponse.redirect(url, 303);
    } catch (e) {
        console.error("Demo checkout failed", e);
        return redirectTo("/products");
    }
}