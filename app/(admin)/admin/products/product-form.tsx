"use client";

import { useActionState } from "react";
import { createProductAction } from "./actions";

const inputClass =
    "mt-2 w-full border border-line bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-ink";
const labelClass = "block text-xs uppercase tracking-[0.2em] text-muted";

export function ProductForm({ categories }: { categories: string[] }) {
    const [state, formAction, pending] = useActionState(createProductAction, undefined);
    const v = state?.values ?? {};

    return (
        <form action={formAction} className="mt-8 grid max-w-2xl gap-6 md:grid-cols-2">
            <label className={`${labelClass} md:col-span-2`}>
                Name
                <input name="name" required maxLength={80} defaultValue={v.name ?? ""} className={inputClass} />
            </label>

            <label className={labelClass}>
                Slug (optional)
                <input name="slug" maxLength={40} placeholder="auto from name" defaultValue={v.slug ?? ""} className={inputClass} />
            </label>

            <label className={labelClass}>
                Category
                <select name="category" required defaultValue={v.category ?? ""} className={inputClass}>
                    <option value="" disabled>
                        Choose...
                    </option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </label>

            <label className={labelClass}>
                Price (USD)
                <input name="price" required inputMode="decimal" placeholder="149.90" defaultValue={v.price ?? ""} className={inputClass} />
            </label>

            <label className={labelClass}>
                Color
                <input name="color" required maxLength={30} defaultValue={v.color ?? ""} className={inputClass} />
            </label>

            <label className={labelClass}>
                EU sizes
                <input name="sizes" required defaultValue={v.sizes ?? "40, 41, 42, 43, 44"} className={inputClass} />
            </label>

            <label className={labelClass}>
                Stock per size
                <input name="stock" required type="number" min={0} max={1000} defaultValue={v.stock ?? "10"} className={inputClass} />
            </label>

            <label className={`${labelClass} md:col-span-2`}>
                Description
                <textarea name="description" required rows={4} maxLength={500} defaultValue={v.description ?? ""} className={inputClass} />
            </label>

            <label className={`${labelClass} md:col-span-2`}>
                Image path (optional)
                <input name="image" placeholder="/products/tempo-02.jpg" defaultValue={v.image ?? ""} className={inputClass} />
                <span className="mt-1 block text-xs normal-case tracking-normal">
                    The file must exist in public/products. Leave empty to use the styled placeholder.
                </span>
            </label>

            {state?.error && (
                <p role="alert" className="text-sm text-accent md:col-span-2">
                    {state.error}
                </p>
            )}

            <div className="md:col-span-2">
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-ink px-8 py-4 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-wait disabled:bg-line disabled:text-muted"
                >
                    {pending ? "Saving..." : "Create product"}
                </button>
            </div>
        </form>
    );
}