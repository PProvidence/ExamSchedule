import {Pool} from 'pg';
import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
  jwtSecret: process.env.JWT_SECRET ?? "jhgfdgfjhk",
  jwtLifetime: process.env.JWT_LIFETIME ?? "1h",
  dbUrl: process.env.DB_URL ?? ""
};

export const connection = new Pool({
  connectionString: config.dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});