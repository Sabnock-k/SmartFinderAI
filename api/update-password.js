import express from "express";
import bcrypt from "bcrypt";
import pool from "./utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await pool.query(
      `SELECT password_hash FROM users WHERE user_id = $1 LIMIT 1`,
      [user_id]
    );

    const match = await bcrypt.compare(
      currentPassword,
      user.rows[0].password_hash
    );

    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(`UPDATE users SET password_hash = $1 WHERE user_id = $2`, [
      hashedPassword,
      user_id,
    ]);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
