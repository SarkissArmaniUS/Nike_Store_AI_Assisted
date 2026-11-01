import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
    variable: "--font-archivo",
    subsets: ["latin"],
    axes: ["wdth"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    title: { default: "Northline", template: "%s | Northline" },
    description: "Footwear built for the long way home.",
    openGraph: { siteName: "Northline", type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${archivo.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}