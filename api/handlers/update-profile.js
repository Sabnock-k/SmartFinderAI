import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, username, full_name, email, facebook_account_link } =
    req.body;
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!username || !full_name || !email) {
    return res
      .status(400)
      .json({ error: "Username, full name, and email are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, full_name = $2, email = $3, facebook_account_link = $4 
       WHERE user_id = $5`,
      [username, full_name, email, facebook_account_link || null, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
