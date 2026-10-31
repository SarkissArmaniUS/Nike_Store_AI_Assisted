// Перетворює "149.90" на 14990 без плаваючої коми. Повертає null, якщо рядок некоректний або сума нульова.
export function dollarsToCents(input: string): number | null {
    const m = /^(\d{1,6})(?:\.(\d{1,2}))?$/.exec(input.trim());
    if (!m) return null;
    const cents = Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0"));
    return cents > 0 ? cents : null;
}