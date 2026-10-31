import mongoose, { Schema } from "mongoose";
import { connectDB } from "./db";

const schema = new Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL: Mongo сам видаляє прострочені
});

const RateLimitModel = mongoose.models.RateLimit ?? mongoose.model("RateLimit", schema);

export async function rateLimit(name: string, limit: number, windowMs: number) {
    try {
        await connectDB();
        const now = Date.now();
        const windowStart = Math.floor(now / windowMs) * windowMs;
        const key = `${name}:${windowStart}`;
        const update = {
            $inc: { count: 1 },
            $setOnInsert: { expiresAt: new Date(windowStart + windowMs * 2) },
        };

        let doc;
        try {
            doc = await RateLimitModel.findOneAndUpdate({ key }, update, { upsert: true, returnDocument: "after" });
        } catch (e) {
            // два паралельні запити одночасно створили ключ: повторюємо вже без створення
            if ((e as { code?: number }).code !== 11000) throw e;
            doc = await RateLimitModel.findOneAndUpdate({ key }, update, { returnDocument: "after" });
        }

        if ((doc?.count ?? 1) > limit) {
            return { ok: false, retryAfterSec: Math.max(1, Math.ceil((windowStart + windowMs - now) / 1000)) };
        }
        return { ok: true, retryAfterSec: 0 };
    } catch (e) {
        // якщо сам лімітер зламався, пропускаємо запит: краще не блокувати оплату через збій допоміжної системи
        console.error("Rate limiter failed, allowing request", e);
        return { ok: true, retryAfterSec: 0 };
    }
}