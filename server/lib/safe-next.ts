export function safeNext(value: string | string[] | undefined, fallback = "/account") {
    if (typeof value !== "string") return fallback;
    if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
    return value;
}