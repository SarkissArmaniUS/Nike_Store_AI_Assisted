"use client";

import { deleteProductAction } from "./actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
    return (
        <form
            action={deleteProductAction}
            onSubmit={(e) => {
                if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
            }}
        >
            <input type="hidden" name="productId" value={id} />
            <button type="submit" className="text-accent underline underline-offset-4">
                Delete
            </button>
        </form>
    );
}