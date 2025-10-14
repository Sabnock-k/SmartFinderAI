import express from "express";
import bcrypt from "bcrypt";
import pool from "./utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, full_name, email, password } = req.body;

  if (!username || !full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exists = await pool.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1`,
      [username, email]
    );

    if (exists.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, full_name, email, password_hash) VALUES ($1, $2, $3, $4)`,
      [username, full_name, email, password_hash]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
