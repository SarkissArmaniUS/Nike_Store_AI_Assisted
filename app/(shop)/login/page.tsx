import { AuthForm } from "@/components/auth/auth-form";
import { safeNext } from "@/server/lib/safe-next";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
    const sp = await searchParams;
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">Sign in</h1>
            <AuthForm mode="login" next={safeNext(sp.next)} />
        </section>
    );
}