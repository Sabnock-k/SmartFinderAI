import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/approved-items - Retrieve all approved items with confirmation status
router.get("/", async (req, res) => {
  try {
    const items = await pool.query(`
      SELECT 
        fi.*, 
        u.full_name,
        cr.founder_confirmed,
        cr.claimer_confirmed,
        cr.admin_approved
      FROM found_items AS fi
      JOIN users AS u ON fi.reported_by_user_id = u.user_id
      LEFT JOIN claim_requests AS cr ON fi.found_item_id = cr.found_item_id
      WHERE fi.is_approved = TRUE
      ORDER BY fi.created_at DESC;
    `);
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
    // Get the user who reported the item
    const userResult = await pool.query(
      "SELECT reported_by_user_id FROM found_items WHERE found_item_id = $1",
      [itemId]
    );
    const userId = userResult.rows[0].reported_by_user_id;

    // Create notification
    const message = `Your reported item has been deleted.`;
    await pool.query(
      "INSERT INTO notifications (recipient_user_id, found_item_id, message) VALUES ($1, $2)",
      [userId, itemId, message]
    );

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

// PUT /api/admin/approved-items/:id/reunited - Mark item as fully returned
router.put("/:id/reunited", async (req, res) => {
  const itemId = req.params.id;
  try {
    // Update reunited flag
    await pool.query(
      `UPDATE claim_requests
       SET admin_approved = TRUE, status = 'reunited'
       WHERE found_item_id = $1
       RETURNING *`,
      [itemId]
    );

    // Get claim request details
    const result = await pool.query(
      `SELECT found_item_id, requested_by_user_id FROM claim_requests WHERE found_item_id = $1`,
      [itemId]
    );

    const claim = result.rows[0];

    // Add to claimed_items
    await pool.query(
      `INSERT INTO claimed_items (found_item_id, claimed_by_user_id) VALUES ($1, $2)`,
      [claim.found_item_id, claim.requested_by_user_id]
    );

    // Update found_items table to mark as reunited
    await pool.query(
      "UPDATE found_items SET reunited = TRUE, status = 'reunited' WHERE found_item_id = $1",
      [itemId]
    );

    // Give points to the founder
    const founderResult = await pool.query(
      "SELECT reported_by_user_id FROM found_items WHERE found_item_id = $1",
      [itemId]
    );

    const founderId = founderResult.rows[0].reported_by_user_id;

    await pool.query(
      "UPDATE users SET points = points + 100 WHERE user_id = $1",
      [founderId]
    );

    // Notify the reporter
    const userResult = await pool.query(
      "SELECT reported_by_user_id FROM found_items WHERE found_item_id = $1",
      [itemId]
    );
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].reported_by_user_id;
      const message = `Your reported item has been successfully returned and marked as reunited. You have earned 100 points.`;
      await pool.query(
        "INSERT INTO notifications (recipient_user_id, found_item_id, message) VALUES ($1, $2, $3)",
        [userId, itemId, message]
      );
    }

    res.json({ message: "Item marked as reunited" });
  } catch (err) {
    console.error("Error marking item as reunited:", err);
    res.status(500).json({ error: "Failed to mark item as reunited" });
  }
});

export default router;
