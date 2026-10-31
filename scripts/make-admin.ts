import { MongoClient } from "mongodb";

const email = process.argv[2]?.toLowerCase();
const uri = process.env.MONGODB_URI;

if (!email) {
    console.error("Usage: npm run make-admin -- user@example.com");
    process.exit(1);
}
if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
}

async function main() {
    const client = new MongoClient(uri!);
    try {
        await client.connect();
        const res = await client.db().collection("user").updateOne({ email }, { $set: { role: "admin" } });
        console.log(res.matchedCount ? `${email} is now an admin` : `No user found with email ${email}`);
    } finally {
        await client.close();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});