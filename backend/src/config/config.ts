import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
    jwtSecret: process.env.JWT_SECRET ?? "jhgfdgfjhk",
    jwtLifetime: process.env.JWT_LIFETIME ?? "1h",
    appEnv: process.env.APP_ENV ?? "local",
    devDbUrl: process.env.MONGODB_URI_DEV,
    prodDbUrl: process.env.MONGODB_URI_PROD,
}

// MongoDB Connection Logic
const dbUrl = config.appEnv === "production" ? config.prodDbUrl : config.devDbUrl;

if (!dbUrl) {
    throw new Error("Database URL is not defined");
}
mongoose.
    connect(dbUrl)
    .then(() => {
        console.log(
            `Connected to the ${config.appEnv === "production" ? "production" : "development"} database`
        );
    })
    .catch((error) => {
        console.error("Failed to connect to the database", error);
    });