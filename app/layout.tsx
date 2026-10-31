import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Northline", template: "%s | Northline" },
  description: "Footwear built for the long way home.",
    openGraph: { siteName: "Northline", type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`${inter.variable} ${instrument.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">{children}</body>
      </html>
  );
}