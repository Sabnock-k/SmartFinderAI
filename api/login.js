import bcrypt from "bcrypt";
import pool from "./utils/db.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1) LIMIT 1`, [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "There is no such user" });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}