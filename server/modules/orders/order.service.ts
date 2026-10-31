import mongoose from "mongoose";
import { connectDB } from "../../lib/db";
import { Product } from "../products/product.model";
import { Order } from "./order.model";
import type { OrderStatus } from "./status";

export class CheckoutError extends Error {
    constructor(
        message: string,
        public status = 400,
    ) {
        super(message);
    }
}

export type Line = { sku: string; qty: number };

export type OrderItem = {
    sku: string;
    slug: string;
    name: string;
    size: number;
    unitPriceCents: number;
    qty: number;
};

export type CreatedOrder = { id: string; currency: string; totalCents: number; items: OrderItem[] };

export async function createPendingOrder(lines: Line[], userId?: string): Promise<CreatedOrder> {
    await connectDB();

    const skus = lines.map((l) => l.sku);
    const products = await Product.find({ isActive: true, "variants.sku": { $in: skus } }).lean();

    const bySku = new Map<string, Omit<OrderItem, "qty"> & { currency: string }>();
    for (const p of products) {
        for (const v of p.variants) {
            if (skus.includes(v.sku)) {
                bySku.set(v.sku, {
                    sku: v.sku,
                    slug: p.slug,
                    name: p.name,
                    size: v.size,
                    unitPriceCents: p.priceCents,
                    currency: p.currency,
                });
            }
        }
    }

    const items: OrderItem[] = lines.map((l) => {
        const found = bySku.get(l.sku);
        if (!found) throw new CheckoutError(`Unknown item: ${l.sku}`);
        return {
            sku: found.sku,
            slug: found.slug,
            name: found.name,
            size: found.size,
            unitPriceCents: found.unitPriceCents,
            qty: l.qty,
        };
    });

    const currencies = new Set(lines.map((l) => bySku.get(l.sku)!.currency));
    if (currencies.size !== 1) throw new CheckoutError("Mixed currencies are not supported");
    const currency = [...currencies][0];

    const totalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.qty, 0);

    const session = await mongoose.startSession();
    let result: CreatedOrder | undefined;
    try {
        await session.withTransaction(async () => {
            for (const it of items) {
                const res = await Product.updateOne(
                    { slug: it.slug, variants: { $elemMatch: { sku: it.sku, stock: { $gte: it.qty } } } },
                    { $inc: { "variants.$.stock": -it.qty } },
                    { session },
                );
                if (res.modifiedCount !== 1) {
                    throw new CheckoutError(`Not enough stock for ${it.name} (EU ${it.size})`, 409);
                }
            }

            const [created] = await Order.create(
                [{ items, totalCents, currency, userId, expiresAt: new Date(Date.now() + 31 * 60 * 1000) }],
                { session },
            );
            result = { id: String(created._id), currency, totalCents, items };
        });
    } finally {
        await session.endSession();
    }

    if (!result) throw new Error("Order was not created");
    return result;
}

export async function cancelPendingOrder(orderId: string) {
    await connectDB();
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const order = await Order.findOneAndUpdate(
                { _id: orderId, status: "pending" },
                { status: "cancelled" },
                { session },
            );
            if (!order) return;

            for (const it of order.items) {
                await Product.updateOne(
                    { "variants.sku": it.sku },
                    { $inc: { "variants.$.stock": it.qty } },
                    { session },
                );
            }
        });
    } finally {
        await session.endSession();
    }
}

export type PaidResult = "paid" | "already_processed" | "not_found" | "mismatch";

export async function markOrderPaid(
    orderId: string,
    data: { amountTotal: number | null; currency: string | null; paymentIntentId?: string; email?: string },
): Promise<PaidResult> {
    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) return "not_found";

    if (data.amountTotal !== order.totalCents || data.currency?.toLowerCase() !== order.currency) {
        console.error("Payment mismatch", { orderId, expected: order.totalCents, got: data.amountTotal });
        return "mismatch";
    }

    const updated = await Order.findOneAndUpdate(
        { _id: orderId, status: "pending" },
        { status: "paid", stripePaymentIntentId: data.paymentIntentId, email: data.email },
    );

    if (!updated && order.status === "cancelled") {
        console.error("Paid after cancel, refund needed", { orderId });
    }
    return updated ? "paid" : "already_processed";
}

export type OrderSummary = {
    id: string;
    createdAt: string;
    status: OrderStatus;
    totalCents: number;
    currency: string;
    items: OrderItem[];
};

export async function listOrdersForUser(userId: string): Promise<OrderSummary[]> {
    await connectDB();
    const docs = await Order.find({ userId, status: { $in: ["paid", "shipped", "refunded"] } })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    return docs.map((d) => ({
        id: String(d._id),
        createdAt: d._id.getTimestamp().toISOString(),
        status: d.status as OrderStatus,
        totalCents: d.totalCents,
        currency: d.currency,
        items: d.items.map((i) => ({
            sku: i.sku,
            slug: i.slug,
            name: i.name,
            size: i.size,
            unitPriceCents: i.unitPriceCents,
            qty: i.qty,
        })),
    }));
}
