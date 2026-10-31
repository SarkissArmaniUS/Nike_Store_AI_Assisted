import { describe, expect, it } from "vitest";
import { safeNext } from "@/server/lib/safe-next";

describe("safeNext", () => {
    it("keeps relative paths", () => {
        expect(safeNext("/account")).toBe("/account");
        expect(safeNext("/products?category=running")).toBe("/products?category=running");
    });

    it("falls back for external or malformed targets", () => {
        for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "evil.com", undefined, ["/a", "/b"]]) {
            expect(safeNext(bad)).toBe("/account");
        }
    });
});