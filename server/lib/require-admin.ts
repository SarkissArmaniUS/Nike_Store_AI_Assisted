import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login?next=/admin");
    if (session.user.role !== "admin") notFound(); // не-адмін не дізнається, що сторінка існує
    return session;
}