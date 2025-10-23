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

  max: 1, // Limit connections for serverless (each function gets 1)
  idleTimeoutMillis: 0, // Close idle connections immediately
  connectionTimeoutMillis: 10000, // 10 second timeout
  allowExitOnIdle: true, // Allow Node.js to exit if idle
});

export default pool;
