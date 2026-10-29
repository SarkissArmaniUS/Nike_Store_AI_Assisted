"use client";

import { useSyncExternalStore } from "react";
import * as store from "./cart-store";

export function useCart() {
    const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

    return {
        items,
        count: items.reduce((sum, i) => sum + i.qty, 0),
        subtotalCents: items.reduce((sum, i) => sum + i.priceCents * i.qty, 0),
        addItem: store.addItem,
        setQty: store.setQty,
        removeItem: store.removeItem,
        clear: store.clearCart,
    };
}