import { z } from "zod";
import { dollarsToCents } from "@/server/lib/money";
import { CATEGORIES } from "./product.model";

export function slugify(input: string) {
    return input
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40)
        .replace(/-+$/g, "");
}

// "40, 41 42" -> [40, 41, 42]. Некоректний ввід дає порожній масив.
export function parseSizes(input: string): number[] {
    const sizes = input.split(/[\s,]+/).filter(Boolean).map(Number);
    if (sizes.length === 0 || !sizes.every((n) => Number.isInteger(n) && n >= 30 && n <= 55)) return [];
    return [...new Set(sizes)].sort((a, b) => a - b);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_RE = /^\/products\/[\w.-]+$/;

export const productFormSchema = z
    .object({
        name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
        slug: z.string().trim().toLowerCase(),
        category: z.enum(CATEGORIES, "Choose a category"),
        price: z
            .string()
            .trim()
            .refine((v) => dollarsToCents(v) !== null, "Price must look like 149.90"),
        description: z.string().trim().min(10, "Description is too short").max(500, "Description is too long"),
        color: z.string().trim().min(1, "Color is required").max(30, "Color is too long"),
        sizes: z.string().refine((v) => parseSizes(v).length > 0, "Enter EU sizes from 30 to 55, e.g. 40, 41, 42"),
        stock: z.coerce
            .number()
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative")
            .max(1000, "Stock is too large"),
        image: z
            .string()
            .trim()
            .refine((v) => v === "" || IMAGE_RE.test(v), "Image must be a path like /products/name.jpg"),
    })
    .transform((v) => ({
        name: v.name,
        slug: v.slug || slugify(v.name),
        category: v.category,
        description: v.description,
        priceCents: dollarsToCents(v.price) ?? 0,
        color: v.color,
        sizes: parseSizes(v.sizes),
        stock: v.stock,
        image: v.image,
    }))
    .refine((v) => SLUG_RE.test(v.slug) && v.slug.length <= 40, {
        message: "Slug: lowercase letters, digits and hyphens only, up to 40 characters",
        path: ["slug"],
    });

export type ProductFormData = z.output<typeof productFormSchema>;