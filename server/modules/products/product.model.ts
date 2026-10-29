import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const CATEGORIES = ["running", "lifestyle"] as const;
export type Category = (typeof CATEGORIES)[number];

const variantSchema = new Schema(
    {
        sku: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: Number, required: true },
        stock: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const productSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, enum: CATEGORIES, required: true, index: true },
        description: { type: String, required: true },
        priceCents: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "usd" },
        images: { type: [String], default: [] },
        variants: { type: [variantSchema], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

productSchema.index({ "variants.sku": 1 });

export type ProductDoc = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDoc> =
    (mongoose.models.Product as Model<ProductDoc>) ??
    mongoose.model<ProductDoc>("Product", productSchema);