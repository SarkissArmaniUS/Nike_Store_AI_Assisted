import { CopyCardButton } from "./copy-card-button";

export function TestModeBanner() {
    return (
        <div className="border-b border-line bg-paper-2 text-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2">
                <p className="text-muted">
                    <span className="text-ink">Test mode.</span> No real payments. Card{" "}
                    <span className="font-mono text-ink">4242 4242 4242 4242</span>, any future date, any CVC.
                </p>
                <div className="flex items-center gap-4">
                    <CopyCardButton />
                    <form method="post" action="/api/demo-checkout">
                        <button
                            type="submit"
                            className="bg-ink px-4 py-1.5 text-paper transition-colors hover:bg-accent hover:text-ink"
                        >
                            Try a test purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}