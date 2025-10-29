import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/reported-items - Retrieve all reported items
router.get("/", async (req, res) => {
  try {
    const items = await pool.query(
      "SELECT fi.*, u.full_name FROM found_items AS fi JOIN users AS u ON fi.reported_by_user_id = u.user_id WHERE is_approved = 'FALSE' ORDER BY fi.created_at DESC;"
    );
    res.json(items.rows);
  } catch (error) {
    console.error("Error fetching reported items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/admin/reported-items/:id/approve - Approve a reported item
router.put("/:id/approve", async (req, res) => {
  const itemId = req.params.id;
  try {
    await pool.query(
      "UPDATE found_items SET is_approved = 'TRUE' WHERE found_item_id = $1",
      [itemId]
    );
    res.status(204).send();
  } catch (error) {
    console.error("Error approving reported item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/reported-items/:id/reject - Reject a reported item
router.delete("/:id/reject", async (req, res) => {
  const itemId = req.params.id;
  try {
    await pool.query(
      "DELETE FROM found_items WHERE found_item_id = $1 RETURNING *;",
      [itemId]
    );
    res.status(204).send();
  } catch (error) {
    console.error("Error rejecting reported item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
