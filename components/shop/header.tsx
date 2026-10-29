import Link from "next/link";

const links = [
    { href: "/products", label: "Shop" },
    { href: "/products?category=running", label: "Running" },
    { href: "/products?category=lifestyle", label: "Lifestyle" },
];

export function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="font-display text-2xl tracking-tight">
                    Northline
                </Link>
                <nav className="hidden gap-8 text-sm md:flex">
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">
                            {l.label}
                        </Link>
                    ))}
                </nav>
                <Link href="/cart" className="text-sm transition-colors hover:text-accent">
                    Cart (0)
                </Link>
            </div>
        </header>
    );
}