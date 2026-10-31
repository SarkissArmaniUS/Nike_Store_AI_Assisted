"use client";

import Link from "next/link";
import { authClient } from "@/components/auth/auth-client";

export function AccountLink() {
    const { data: session, isPending } = authClient.useSession();
    if (isPending) return <span className="inline-block w-14" aria-hidden />;

    return (
        <Link
            href={session ? "/account" : "/login"}
            className="text-sm text-muted transition-colors hover:text-ink"
        >
            {session ? "Account" : "Sign in"}
        </Link>
    );
}