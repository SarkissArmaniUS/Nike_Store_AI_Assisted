import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import mongoose from "mongoose";
import { connectDB } from "../server/lib/db";
import { Product } from "../server/modules/products/product.model";

const EXTS = ["webp", "avif", "jpg", "jpeg", "png"];
const slugs = ["ridge-runner", "tempo-01", "harbor-low", "meridian", "polar-mid", "summit-race"];
const dir = join(process.cwd(), "public", "products");

async function main() {
    console.log(`Looking in ${dir}`);
    console.log(existsSync(dir) ? `Files: ${readdirSync(dir).join(", ") || "(empty)"}` : "Folder does not exist");

    await connectDB();
    for (const slug of slugs) {
        const ext = EXTS.find((e) => existsSync(join(dir, `${slug}.${e}`)));
        if (!ext) {
            console.log(`${slug}: no file found (tried ${EXTS.join(", ")})`);
            continue;
        }
        const res = await Product.updateOne({ slug }, { images: [`/products/${slug}.${ext}`] });
        console.log(`${slug}.${ext}: ${res.matchedCount ? "updated" : "product not found"}`);
    }
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});