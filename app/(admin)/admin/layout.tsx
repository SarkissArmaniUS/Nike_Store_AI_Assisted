import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/server/lib/require-admin";

export const metadata: Metadata = {
    title: { default: "Admin", template: "%s | Admin" },
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
    const session = await requireAdmin();

    return (
        <div className="flex-1">
            <header className="border-b border-line bg-paper-2">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3 text-sm">
                    <div className="flex items-center gap-6">
                        <span className="font-display text-xl">Northline Admin</span>
                        <nav aria-label="Admin" className="flex gap-4 text-muted">
                            <Link href="/admin" className="hover:text-ink">Overview</Link>
                            <Link href="/admin/orders" className="hover:text-ink">Orders</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4 text-muted">
                        <span>{session.user.email}</span>
                        <Link href="/" className="underline underline-offset-4 hover:text-accent">View shop</Link>
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
        </div>
    );
}