import express from "express";
import bcrypt from "bcrypt";
import pool from "../utils/db.js";

const router = express.Router();

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= minLength;

  const errors = [];

  if (!isLongEnough) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!hasNumber) {
    errors.push("Password must contain at least one number");
  }
  if (!hasSpecialChar) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

router.post("/", async (req, res) => {
  const { username, full_name, email, password } = req.body;

  if (!username || !full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      error: "Password does not meet requirements",
      details: passwordValidation.errors,
    });
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
