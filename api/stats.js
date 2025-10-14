import express from "express";
import pool from "./utils/db.js";

const router = express.Router();

// GET /api/stats - Retrieve platform statistics
router.get("/", async (req, res) => {
  try {
    const reunitedItems = await pool.query(
      "SELECT COUNT(*) FROM found_items WHERE reunited = TRUE;"
    );

    const happyUsers = await pool.query("SELECT COUNT(*) FROM users;");

    const activeListings = await pool.query(
      "SELECT COUNT(*) FROM found_items WHERE is_approved = TRUE AND reunited = FALSE;"
    );

    res.json({
      reunitedItems: reunitedItems.rows[0].count,
      happyUsers: happyUsers.rows[0].count,
      activeListings: activeListings.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
