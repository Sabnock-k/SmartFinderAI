import express from "express";
import jwt from "jsonwebtoken";
import pool from "../utils/db.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d"; // or 1d, 30d, etc.

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
    // Check if username or email is already taken by another user
    const duplicateCheck = await pool.query(
      `SELECT user_id FROM users 
       WHERE (username = $1 OR email = $2) AND user_id != $3`,
      [username, email, user_id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        error: "Username or email is already taken",
      });
    }

    // Update user profile
    const result = await pool.query(
      `UPDATE users 
       SET username = $1, full_name = $2, email = $3, facebook_account_link = $4 
       WHERE user_id = $5
       RETURNING user_id, username, full_name, email, facebook_account_link, is_admin, created_at`,
      [username, full_name, email, facebook_account_link || null, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = result.rows[0];

    // Generate new JWT token with updated user data
    const token = jwt.sign(
      {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        facebook_account_link: updatedUser.facebook_account_link,
        is_admin: updatedUser.is_admin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      message: "Profile updated successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "Error updating profile: Internal server error" });
  }
});

export default router;
