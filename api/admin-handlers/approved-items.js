import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/approved-items - Retrieve all approved items
router.get("/", async (req, res) => {
  try {
    const items = await pool.query(
      "SELECT fi.*,u.full_name FROM found_items AS fi JOIN users AS u ON fi.reported_by_user_id = u.user_id WHERE is_approved = 'TRUE' ORDER BY fi.created_at DESC;"
    );
    res.json(items.rows);
  } catch (error) {
    console.error("Error fetching approved items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/approved-items/:id - Delete an approved item
router.delete("/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    await pool.query(
      "DELETE FROM found_items WHERE found_item_id = $1 RETURNING *;",
      [itemId]
    );
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting approved item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
