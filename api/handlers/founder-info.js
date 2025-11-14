import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/founder-info/:userId - Get info on the founder
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        full_name, 
        email, 
        facebook_account_link 
      FROM users 
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Founder not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting the founder's info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
