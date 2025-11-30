import express from "express";
import bcrypt from "bcrypt";
import pool from "../utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const identifier = (username || "").trim();

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  if (identifier.length < 3 || identifier.length > 254) {
    return res.status(400).json({ error: "Invalid username." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
      [identifier]
    );

    const user = result.rows[0];

    if (!user) {
      // No user found
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Remove sensitive fields before sending
    const { password_hash, reset_token, ...safeUser } = user;

    res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
