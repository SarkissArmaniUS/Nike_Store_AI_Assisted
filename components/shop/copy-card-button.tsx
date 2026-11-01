"use client";

import { useState } from "react";

export function CopyCardButton() {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText("4242424242424242");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // буфер обміну може бути недоступний, тоді картку видно в тексті поруч
        }
    }

    return (
        <button type="button" onClick={copy} aria-live="polite" className="underline underline-offset-4 hover:text-accent">
            {copied ? "Copied" : "Copy card number"}
        </button>
    );
}