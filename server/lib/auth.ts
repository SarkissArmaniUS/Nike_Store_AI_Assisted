import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient } from "./mongo-client";

export const auth = betterAuth({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    // client потрібен, щоб адаптер використовував транзакції (Atlas це підтримує)
    database: mongodbAdapter(mongoClient.db(), { client: mongoClient }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    user: {
        additionalFields: {
            // input: false не дає користувачу виставити собі роль під час реєстрації
            role: { type: "string", defaultValue: "customer", input: false },
        },
    },
    plugins: [nextCookies()], // має бути останнім
});