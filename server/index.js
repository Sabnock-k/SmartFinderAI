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
        // Compare password
        if (password !== user.password_hash) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));