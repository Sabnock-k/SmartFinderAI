import express from "express";
import bcrypt from "bcrypt";
import pool from "../utils/db.js";

const router = express.Router();

/**
 * ============================
 * Password Validation
 * ============================
 */
const validatePassword = (newPassword) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isLongEnough = newPassword.length >= minLength;

  const errors = [];

  if (!isLongEnough) errors.push("Password must be at least 8 characters long");
  if (!hasUpperCase)
    errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase)
    errors.push("Password must contain at least one lowercase letter");
  if (!hasNumber) errors.push("Password must contain at least one number");
  if (!hasSpecialChar)
    errors.push(
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    );

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * ============================
 * Update Admin Password
 * POST /api/admin/update-password
 * ============================
 */
router.post("/update-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(", ") });
    }

    // Fetch admin user
    const userRes = await pool.query(
      "SELECT user_id, password_hash FROM users WHERE user_id = $1 AND is_admin = TRUE",
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const admin = userRes.rows[0];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update DB
    await pool.query("UPDATE users SET password_hash = $1 WHERE user_id = $2", [
      hashedPassword,
      userId,
    ]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * ============================
 * Get System Settings
 * GET /api/admin/settings
 * ============================
 */
router.get("/settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM system_settings LIMIT 1");

    if (result.rows.length === 0) {
      return res.json({
        auto_approve: false,
        expiration_days: 30,
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * ============================
 * Update System Settings
 * POST /api/admin/settings
 * ============================
 */
router.post("/update-settings", async (req, res) => {
  try {
    const { auto_approve, expiration_days } = req.body;

    await pool.query(
      `
      INSERT INTO system_settings (id, auto_approve, expiration_days)
      VALUES (1, $1, $2)
      ON CONFLICT (id) DO UPDATE
      SET auto_approve = $1, expiration_days = $2
      `,
      [auto_approve, expiration_days]
    );

    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    console.error("Error updating settings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
