import bcrypt from "bcrypt";
import pkg from "pg";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    // eslint-disable-next-line no-undef
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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

        const token = jwt.sign({ id: user.id, username: user.username },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET, // Add JWT_SECRET in your .env
            { expiresIn: "2h" } // token valid for 1 hour
        );

        res.status(200).json({ user, sessionToken: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}