import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

// Detect environment: "development" for local, "production" for Neon
const isProduction = true; // Change to false for local testing

// Error trap kung wala na set tang database URL
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool = new Pool({
  connectionString: isProduction
    ? process.env.DATABASE_URL
    : process.env.LOCAL_DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Neon / production
    : false, // local dev
});

export default pool;
