import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ORDER_STATUSES } from "./status";

const itemSchema = new Schema(
    {
        sku: { type: String, required: true },
        slug: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, required: true },
        unitPriceCents: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false },
);

const orderSchema = new Schema(
    {
        items: { type: [itemSchema], required: true },
        totalCents: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true },
        status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
        stripeSessionId: { type: String, unique: true, sparse: true },
        stripePaymentIntentId: { type: String },
        email: { type: String },
        userId: { type: String, index: true },
        expiresAt: { type: Date },
    },
    { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema>;

export const Order: Model<OrderDoc> =
    (mongoose.models.Order as Model<OrderDoc>) ?? mongoose.model<OrderDoc>("Order", orderSchema);
