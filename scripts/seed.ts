import mongoose from "mongoose";
import { connectDB } from "../server/lib/db";
import { Product } from "../server/modules/products/product.model";

const sizes = [40, 41, 42, 43, 44];
const mk = (sku: string, color: string) =>
    sizes.map((size) => ({ sku: `${sku}-${size}`, color, size, stock: 10 }));

const products = [
    { slug: "ridge-runner", name: "Ridge Runner", category: "running", priceCents: 14000, description: "Lightweight trail runner with a responsive foam midsole.", variants: mk("RR-SND", "Sand") },
    { slug: "tempo-01", name: "Tempo 01", category: "running", priceCents: 16500, description: "Daily road trainer built for steady miles.", variants: mk("T01-INK", "Ink") },
    { slug: "harbor-low", name: "Harbor Low", category: "lifestyle", priceCents: 12000, description: "Clean leather low-top for everyday wear.", variants: mk("HL-BON", "Bone") },
    { slug: "meridian", name: "Meridian", category: "lifestyle", priceCents: 13500, description: "Suede sneaker with a stitched gum sole.", variants: mk("MR-CLY", "Clay") },
    { slug: "polar-mid", name: "Polar Mid", category: "lifestyle", priceCents: 15500, description: "Water-resistant mid-top for cold, wet days.", variants: mk("PM-SLT", "Slate") },
    { slug: "summit-race", name: "Summit Race", category: "running", priceCents: 19000, description: "Carbon-plated racer for personal bests.", variants: mk("SR-EMB", "Ember") },
];

async function main() {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});