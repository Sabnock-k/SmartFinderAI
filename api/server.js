import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    // eslint-disable-next-line no-undef
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Login endpoint
app.post("/login", async(req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1`, [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Register endpoint
app.post("/register", async(req, res) => {
    const { username, full_name, email, password } = req.body;
    if (!username || !full_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const exists = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1`, [username, email]
        );
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: "Username or email already exists" });
        }

        const password_hash = await bcrypt.hash(password, 10);
        await pool.query(
            `INSERT INTO users (username, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`, [username, full_name, email, password_hash]
        );

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Export for Vercel
export default app;

// Run locally (only if not in Vercel)
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "production") {
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}