import express from "express";
import bcrypt from "bcrypt";
import pool from "./utils/db.js";
import rateLimit from "express-rate-limit";
import validator from "validator";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // basic validation/sanitization
  const identifier = (username || "").trim();
  if (
    !identifier ||
    !password ||
    identifier.length < 3 ||
    identifier.length > 254
  ) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (!validator.isAscii(identifier)) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1) LIMIT 1`,
      [identifier]
    );

    // Use a fake bcrypt hash to make timing similar when user not found
    const FAKE_HASH =
      process.env.FAKE_BCRYPT_HASH ||
      "$2b$10$CwTycUXWue0Thq9StjUM0uJ8sQePOq4IY8h4hQzYlWqKZr9q.ZQG."; // example bcrypt hash

    if (result.rows.length === 0) {
      // do a fake compare to mitigate timing attacks
      await bcrypt.compare(password, FAKE_HASH);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
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
