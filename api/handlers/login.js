import express from "express";
import pool from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d"; // or 1d, 30d, etc.

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const identifier = (username || "").trim();
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
      [identifier]
    );

    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid username or password" });

    // Remove sensitive fields
    const { password_hash, reset_token, ...safeUser } = user;

    // Create JWT payload
    const token = jwt.sign(
      {
        user_id: safeUser.user_id,
        username: safeUser.username,
        full_name: safeUser.full_name,
        email: safeUser.email,
        facebook_account_link: safeUser.facebook_account_link,
        is_admin: safeUser.is_admin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
