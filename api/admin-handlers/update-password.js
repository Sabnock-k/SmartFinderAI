import express from "express";
import bcrypt from "bcrypt";
import pool from "../utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "New password must be at least 6 characters" });
  }

  try {
    const user = await pool.query(
      `SELECT password_hash FROM users WHERE user_id = $1 AND is_admin = true LIMIT 1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(`UPDATE users SET password_hash = $1 WHERE user_id = $2`, [
      newPasswordHash,
      userId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
