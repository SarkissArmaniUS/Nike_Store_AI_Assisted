export default function Loading() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16" aria-busy="true" aria-label="Loading products">
    <div className="h-16 w-48 animate-pulse bg-paper-2" />
    <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                <div className="aspect-[4/5] animate-pulse bg-paper-2" />
                <div className="mt-4 h-6 w-2/3 animate-pulse bg-paper-2" />
                    </div>
            ))}
        </div>
        </section>
);
}