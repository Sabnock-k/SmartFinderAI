import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/items/:user_id - Retrieve all items for a specific user
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const items = await pool.query(
      "SELECT * FROM found_items WHERE reported_by_user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(items.rows);
  } catch (err) {
    console.error("Error retrieving items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
