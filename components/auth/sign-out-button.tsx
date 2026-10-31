"use client";

import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";

export function SignOutButton() {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={async () => {
                await authClient.signOut();
                router.push("/");
                router.refresh();
            }}
            className="text-sm text-muted underline underline-offset-4 hover:text-accent"
        >
            Sign out
        </button>
    );
}