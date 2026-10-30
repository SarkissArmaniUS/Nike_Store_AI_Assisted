import type Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/modules/orders/order.service", () => ({
    markOrderPaid: vi.fn().mockResolvedValue("paid"),
    cancelPendingOrder: vi.fn().mockResolvedValue(undefined),
}));

import { cancelPendingOrder, markOrderPaid } from "@/server/modules/orders/order.service";
import { handleStripeEvent } from "@/server/modules/payments/webhook.service";

const ORDER_ID = "6ae44e35bd27ec517d4a1893";

function event(type: string, object: Record<string, unknown>) {
    return { type, data: { object } } as unknown as Stripe.Event;
}

describe("handleStripeEvent", () => {
    beforeEach(() => vi.clearAllMocks());

    it("marks the order paid on a paid checkout.session.completed", async () => {
        await handleStripeEvent(
            event("checkout.session.completed", {
                metadata: { orderId: ORDER_ID },
                payment_status: "paid",
                amount_total: 16500,
                currency: "usd",
                payment_intent: "pi_1",
                customer_details: { email: "a@b.com" },
            }),
        );
        expect(markOrderPaid).toHaveBeenCalledWith(
            ORDER_ID,
            expect.objectContaining({ amountTotal: 16500, currency: "usd", paymentIntentId: "pi_1" }),
        );
    });

    it("ignores a completed session that is not paid yet", async () => {
        await handleStripeEvent(
            event("checkout.session.completed", { metadata: { orderId: ORDER_ID }, payment_status: "unpaid" }),
        );
        expect(markOrderPaid).not.toHaveBeenCalled();
    });

    it("ignores events without a valid order id", async () => {
        await handleStripeEvent(event("checkout.session.completed", { metadata: {}, payment_status: "paid" }));
        await handleStripeEvent(
            event("checkout.session.completed", { metadata: { orderId: "not-an-id" }, payment_status: "paid" }),
        );
        expect(markOrderPaid).not.toHaveBeenCalled();
    });

    it("cancels the order when the session expires", async () => {
        await handleStripeEvent(event("checkout.session.expired", { metadata: { orderId: ORDER_ID } }));
        expect(cancelPendingOrder).toHaveBeenCalledWith(ORDER_ID);
    });

    it("ignores unrelated events", async () => {
        await handleStripeEvent(event("charge.succeeded", {}));
        expect(markOrderPaid).not.toHaveBeenCalled();
        expect(cancelPendingOrder).not.toHaveBeenCalled();
    });
});