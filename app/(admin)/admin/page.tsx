import { formatPrice } from "@/components/shop/product-card";
import { requireAdmin } from "@/server/lib/require-admin";
import { getOrderStats } from "@/server/modules/orders/order.service";

export const metadata = { title: "Overview" };

export default async function AdminPage() {
    await requireAdmin();
    const { revenueCents, counts } = await getOrderStats();

    const cards = [
        { label: "Revenue", value: formatPrice(revenueCents, "usd") },
        { label: "Awaiting payment", value: String(counts.pending) },
        { label: "To ship", value: String(counts.paid) },
        { label: "Shipped", value: String(counts.shipped) },
    ];

    return (
        <section>
            <h1 className="font-display text-4xl tracking-tight">Overview</h1>
            <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
                {cards.map((c) => (
                    <div key={c.label} className="bg-paper p-6">
                        <dt className="text-xs uppercase tracking-[0.2em] text-muted">{c.label}</dt>
                        <dd className="mt-3 font-display text-4xl">{c.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}