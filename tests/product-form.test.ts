import { describe, expect, it } from "vitest";
import { dollarsToCents } from "@/server/lib/money";
import { parseSizes, productFormSchema, slugify } from "@/server/modules/products/product.schema";

const valid = {
    name: "Tempo 02",
    slug: "",
    category: "running",
    price: "149.90",
    description: "A lightweight road trainer.",
    color: "Ink",
    sizes: "40, 41, 42",
    stock: "10",
    image: "",
};

describe("dollarsToCents", () => {
    it("converts without floating point errors", () => {
        expect(dollarsToCents("19.99")).toBe(1999);
        expect(dollarsToCents("129.9")).toBe(12990);
        expect(dollarsToCents("120")).toBe(12000);
    });

    it("rejects invalid or zero amounts", () => {
        for (const bad of ["", "0", "0.00", "-5", "1.999", "abc", "1,5", "1e3"]) {
            expect(dollarsToCents(bad)).toBeNull();
        }
    });
});

describe("slugify and parseSizes", () => {
    it("builds clean slugs", () => {
        expect(slugify("Tempo 01")).toBe("tempo-01");
        expect(slugify("  Ridge  Runner!! ")).toBe("ridge-runner");
    });

    it("parses, dedupes and sorts sizes", () => {
        expect(parseSizes("42, 40 40,41")).toEqual([40, 41, 42]);
    });

    it("returns an empty list for invalid sizes", () => {
        for (const bad of ["", "abc", "29", "56", "40.5"]) expect(parseSizes(bad)).toEqual([]);
    });
});

describe("productFormSchema", () => {
    it("accepts valid input and derives slug, cents and sizes", () => {
        const result = productFormSchema.safeParse(valid);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toMatchObject({ slug: "tempo-02", priceCents: 14990, sizes: [40, 41, 42], stock: 10 });
        }
    });

    it("rejects external image URLs", () => {
        expect(productFormSchema.safeParse({ ...valid, image: "https://evil.com/x.png" }).success).toBe(false);
    });

    it("accepts a local image path", () => {
        expect(productFormSchema.safeParse({ ...valid, image: "/products/tempo-02.jpg" }).success).toBe(true);
    });

    it("rejects a bad price, category and slug", () => {
        expect(productFormSchema.safeParse({ ...valid, price: "abc" }).success).toBe(false);
        expect(productFormSchema.safeParse({ ...valid, category: "boots" }).success).toBe(false);
        expect(productFormSchema.safeParse({ ...valid, slug: "bad slug!" }).success).toBe(false);
    });
});