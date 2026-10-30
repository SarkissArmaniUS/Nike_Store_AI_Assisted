import { describe, expect, it } from "vitest";
import { canTransition } from "@/server/modules/orders/status";

describe("order status transitions", () => {
    it("allows pending -> paid and pending -> cancelled", () => {
        expect(canTransition("pending", "paid")).toBe(true);
        expect(canTransition("pending", "cancelled")).toBe(true);
    });

    it("allows paid -> shipped and paid -> refunded", () => {
        expect(canTransition("paid", "shipped")).toBe(true);
        expect(canTransition("paid", "refunded")).toBe(true);
    });

    it("does not allow skipping payment", () => {
        expect(canTransition("pending", "shipped")).toBe(false);
        expect(canTransition("pending", "refunded")).toBe(false);
    });

    it("does not allow leaving terminal states", () => {
        expect(canTransition("cancelled", "paid")).toBe(false);
        expect(canTransition("refunded", "paid")).toBe(false);
    });

    it("does not allow going backwards", () => {
        expect(canTransition("paid", "pending")).toBe(false);
        expect(canTransition("shipped", "paid")).toBe(false);
    });
});