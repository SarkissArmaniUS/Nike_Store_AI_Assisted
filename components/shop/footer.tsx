import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
                <div className="md:col-span-2">
                    <p className="font-display text-3xl">Northline</p>
                    <p className="mt-3 max-w-xs text-sm text-muted">
                        Footwear built for the long way home.
                    </p>
                </div>
                <div className="text-sm">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Shop</p>
                    <ul className="space-y-2">
                        <li><Link href="/products" className="hover:text-accent">All products</Link></li>
                        <li><Link href="/cart" className="hover:text-accent">Cart</Link></li>
                    </ul>
                </div>
                <div className="text-sm">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Account</p>
                    <ul className="space-y-2">
                        <li><Link href="/login" className="hover:text-accent">Sign in</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-line py-6 text-center text-xs text-muted">
                Portfolio project. Fictional brand. Payments run in Stripe test mode.
            </div>
        </footer>
    );
}