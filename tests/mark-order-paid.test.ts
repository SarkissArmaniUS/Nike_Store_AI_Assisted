import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/lib/db", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/modules/orders/order.model", () => ({
    Order: { findById: vi.fn(), findOneAndUpdate: vi.fn() },
}));

import { Order } from "@/server/modules/orders/order.model";
import { markOrderPaid } from "@/server/modules/orders/order.service";

const ORDER_ID = "6ae44e35bd27ec517d4a1893";
const payment = { amountTotal: 16500, currency: "usd", paymentIntentId: "pi_1", email: "a@b.com" };

function mockOrder(overrides: Record<string, unknown> = {}) {
    vi.mocked(Order.findById).mockResolvedValue({
        totalCents: 16500,
        currency: "usd",
        status: "pending",
        ...overrides,
    } as never);
}

describe("markOrderPaid", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns not_found for an unknown order", async () => {
        vi.mocked(Order.findById).mockResolvedValue(null as never);
        expect(await markOrderPaid(ORDER_ID, payment)).toBe("not_found");
        expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects a payment with a different amount", async () => {
        mockOrder();
        expect(await markOrderPaid(ORDER_ID, { ...payment, amountTotal: 100 })).toBe("mismatch");
        expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects a payment with a different currency", async () => {
        mockOrder();
        expect(await markOrderPaid(ORDER_ID, { ...payment, currency: "eur" })).toBe("mismatch");
        expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it("marks a pending order as paid, matching only pending orders", async () => {
        mockOrder();
        vi.mocked(Order.findOneAndUpdate).mockResolvedValue({ _id: ORDER_ID } as never);

        expect(await markOrderPaid(ORDER_ID, payment)).toBe("paid");
        expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: ORDER_ID, status: "pending" },
            expect.objectContaining({ status: "paid", stripePaymentIntentId: "pi_1" }),
        );
    });

    it("is idempotent: a repeated event for a paid order changes nothing", async () => {
        mockOrder({ status: "paid" });
        vi.mocked(Order.findOneAndUpdate).mockResolvedValue(null as never);
        expect(await markOrderPaid(ORDER_ID, payment)).toBe("already_processed");
    });

    it("logs when a payment arrives for a cancelled order", async () => {
        mockOrder({ status: "cancelled" });
        vi.mocked(Order.findOneAndUpdate).mockResolvedValue(null as never);

        expect(await markOrderPaid(ORDER_ID, payment)).toBe("already_processed");
        expect(console.error).toHaveBeenCalledWith(
            "Paid after cancel, refund needed",
            expect.objectContaining({ orderId: ORDER_ID }),
        );
    });
});