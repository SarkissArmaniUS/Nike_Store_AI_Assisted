import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { formatPrice } from "@/components/shop/product-card";
import { auth } from "@/server/lib/auth";
import { listOrdersForUser } from "@/server/modules/orders/order.service";

export const metadata = { title: "Account" };

const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function AccountPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login?next=/account");

    const orders = await listOrdersForUser(session.user.id);

    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Account</p>
                    <h1 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">{session.user.name}</h1>
                    <p className="mt-2 text-sm text-muted">{session.user.email}</p>
                </div>
                <SignOutButton />
            </div>

            <h2 className="mt-16 border-b border-line pb-4 text-xs uppercase tracking-[0.2em] text-muted">
                Order history
            </h2>

            {orders.length === 0 ? (
                <div className="mt-8">
                    <p className="text-muted">No orders yet.</p>
                    <Link href="/products" className="mt-4 inline-block underline underline-offset-4">
                        Start shopping
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-line">
                    {orders.map((o) => (
                        <li key={o.id} className="py-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="text-sm text-muted">
                                    {dateFmt.format(new Date(o.createdAt))} · <span className="capitalize">{o.status}</span>
                                </p>
                                <p className="text-sm">{formatPrice(o.totalCents, o.currency)}</p>
                            </div>
                            <ul className="mt-3 space-y-1 text-sm">
                                {o.items.map((i) => (
                                    <li key={i.sku}>
                                        {i.name} / EU {i.size} × {i.qty}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}