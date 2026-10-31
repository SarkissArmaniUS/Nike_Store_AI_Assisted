"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "./auth-client";

const inputClass =
    "mt-2 w-full border border-line bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isRegister = mode === "register";

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "");
        const password = String(fd.get("password") ?? "");
        const name = String(fd.get("name") ?? "");

        const result = isRegister
            ? await authClient.signUp.email({ email, password, name })
            : await authClient.signIn.email({ email, password });

        if (result.error) {
            setError(result.error.message ?? "Something went wrong. Please try again.");
            setLoading(false);
            return;
        }
        router.push(next);
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="mt-10 max-w-sm space-y-6">
            {isRegister && (
                <label className="block text-xs uppercase tracking-[0.2em] text-muted">
                    Name
                    <input name="name" type="text" required autoComplete="name" className={inputClass} />
                </label>
            )}
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
                Email
                <input name="email" type="email" required autoComplete="email" className={inputClass} />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-muted">
                Password
                <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className={inputClass}
                />
            </label>

            {error && (
                <p role="alert" className="text-sm text-accent">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink py-4 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-wait disabled:bg-line disabled:text-muted"
            >
                {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
            </button>

            <p className="text-sm text-muted">
                {isRegister ? "Already have an account? " : "New here? "}
                <Link
                    href={`${isRegister ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}
                    className="text-ink underline underline-offset-4"
                >
                    {isRegister ? "Sign in" : "Create an account"}
                </Link>
            </p>
        </form>
    );
}