import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
  jwtSecret: process.env.JWT_SECRET ?? "jhgfdgfjhk",
  jwtLifetime: process.env.JWT_LIFETIME ?? "1h",
  dbHost: process.env.DB_HOSTNAME ?? "localhost",
  dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5000,
  dbUser: process.env.DB_USERNAME ?? "root",
  dbPassword: process.env.DB_PASSWORD ?? "",
  dbName: process.env.DB_NAME ?? "",
};

export const connection = createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
