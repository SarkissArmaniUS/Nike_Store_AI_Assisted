import { z } from "zod";

export const MAX_QTY = 10;
const KEY = "northline-cart";

const itemSchema = z.object({
    sku: z.string(),
    slug: z.string(),
    name: z.string(),
    size: z.number(),
    priceCents: z.number().int().nonnegative(),
    currency: z.string(),
    qty: z.number().int().min(1).max(MAX_QTY),
});

export type CartItem = z.infer<typeof itemSchema>;

const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return;
        const parsed = z.array(itemSchema).safeParse(JSON.parse(raw));
        if (parsed.success) items = parsed.data;
    } catch {
        // пошкоджені дані ігноруємо, кошик буде порожнім
    }
}

function commit(next: CartItem[]) {
    items = next;
    try {
        localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
        // сховище може бути недоступне (приватний режим)
    }
    listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getSnapshot() {
    load();
    return items;
}

export function getServerSnapshot() {
    return EMPTY;
}

export function addItem(item: Omit<CartItem, "qty">) {
    load();
    const existing = items.find((i) => i.sku === item.sku);
    if (existing) {
        commit(items.map((i) => (i.sku === item.sku ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i)));
    } else {
        commit([...items, { ...item, qty: 1 }]);
    }
}

export function setQty(sku: string, qty: number) {
    load();
    if (qty < 1) return removeItem(sku);
    commit(items.map((i) => (i.sku === sku ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)));
}

export function removeItem(sku: string) {
    load();
    commit(items.filter((i) => i.sku !== sku));
}

export function clearCart() {
    commit(EMPTY);
}