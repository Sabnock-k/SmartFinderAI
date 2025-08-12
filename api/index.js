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
app.post("/api/login", async(req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1`, [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result.rows[0];
        // Compare password with hashed password
        const Match = await bcrypt.compare(password, user.password_hash);
        if (!Match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Register endpoint
app.post("/api/register", async(req, res) => {
    const { username, full_name, email, password } = req.body;
    if (!username || !full_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // Check if username or email already exists
        const exists = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1`, [username, email]
        );
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: "Username or email already exists" });
        }
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        // Insert user
        await pool.query(
            `INSERT INTO users (username, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`, [username, full_name, email, password_hash]
        );
        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));