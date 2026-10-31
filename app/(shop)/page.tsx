import { RouteHero } from "@/components/shop/route-hero";

const base = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        { "@type": "Organization", name: "Northline", url: base },
        { "@type": "WebSite", name: "Northline", url: base },
    ],
};

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <RouteHero />
        </>
    );
}