export const ORDER_STATUSES = ["pending", "paid", "shipped", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["paid", "cancelled"],
    paid: ["shipped", "refunded"],
    shipped: ["refunded"],
    cancelled: [],
    refunded: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
    return ALLOWED_TRANSITIONS[from].includes(to);
}