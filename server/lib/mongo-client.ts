import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// Один клієнт на процес, щоб dev-перезавантаження не плодили з'єднання
const g = globalThis as unknown as { _mongoClient?: MongoClient };
export const mongoClient = (g._mongoClient ??= new MongoClient(uri));