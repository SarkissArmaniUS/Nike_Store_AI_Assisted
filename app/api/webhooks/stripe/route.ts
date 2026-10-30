import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/server/lib/stripe";
import { handleStripeEvent } from "@/server/modules/payments/webhook.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
        console.error("STRIPE_WEBHOOK_SECRET is not set");
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const signature = req.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        await handleStripeEvent(event);
        return NextResponse.json({ received: true });
    } catch (e) {
        console.error("Webhook handler failed", event.id, e);
        return NextResponse.json({ error: "Handler failed" }, { status: 500 });
    }
}