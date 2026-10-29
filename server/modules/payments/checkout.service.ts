import { stripe } from "../../lib/stripe";
import { Order } from "../orders/order.model";
import { cancelPendingOrder, createPendingOrder, type Line } from "../orders/order.service";

export async function createCheckoutSession(lines: Line[]): Promise<string> {
    const order = await createPendingOrder(lines);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    try {
        const session = await stripe.checkout.sessions.create(
            {
                mode: "payment",
                client_reference_id: order.id,
                metadata: { orderId: order.id },
                line_items: order.items.map((i) => ({
                    quantity: i.qty,
                    price_data: {
                        currency: order.currency,
                        unit_amount: i.unitPriceCents,
                        product_data: { name: `${i.name} / EU ${i.size}` },
                    },
                })),
                success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${appUrl}/cart`,
                expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
            },
            { idempotencyKey: `checkout-${order.id}` },
        );

        if (!session.url) throw new Error("Stripe returned no checkout URL");
        await Order.updateOne({ _id: order.id }, { stripeSessionId: session.id });
        return session.url;
    } catch (e) {
        await cancelPendingOrder(order.id); // повертаємо склад, якщо оплату не вдалося створити
        throw e;
    }
}