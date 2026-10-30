import mongoose from "mongoose";
import type Stripe from "stripe";
import { cancelPendingOrder, markOrderPaid } from "../orders/order.service";

export async function handleStripeEvent(event: Stripe.Event) {
    switch (event.type) {
        case "checkout.session.completed": {
            const s = event.data.object;
            const orderId = s.metadata?.orderId;
            if (!orderId || !mongoose.isValidObjectId(orderId)) return;
            if (s.payment_status !== "paid") return; // гроші ще не надійшли

            await markOrderPaid(orderId, {
                amountTotal: s.amount_total,
                currency: s.currency,
                paymentIntentId: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id,
                email: s.customer_details?.email ?? undefined,
            });
            return;
        }
        case "checkout.session.expired": {
            const orderId = event.data.object.metadata?.orderId;
            if (orderId && mongoose.isValidObjectId(orderId)) await cancelPendingOrder(orderId);
            return;
        }
        default:
            return; // інші події ігноруємо
    }
}