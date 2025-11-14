import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/items/:user_id - Retrieve all items for a specific user
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const items = await pool.query(
      `
      SELECT 
        fi.*, 
        cr.founder_confirmed
      FROM found_items AS fi 
      LEFT JOIN claim_requests AS cr
      ON fi.found_item_id = cr.found_item_id 
      WHERE fi.reported_by_user_id = $1 
      ORDER BY fi.created_at DESC;
      `,
      [user_id]
    );
    res.json(items.rows);
  } catch (err) {
    console.error("Error retrieving items:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/claimed-items/:userId
router.get("/claimed-items/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        cr.claim_request_id,
        cr.found_item_id,
        cr.founder_confirmed,
        cr.claimer_confirmed,
        fi.description,
        fi.image_url,
        fi.location_description,
        fi.date_time_found,
        fi.reunited,
        fi.status
      FROM claim_requests cr
      JOIN found_items fi ON cr.found_item_id = fi.found_item_id
      WHERE cr.requested_by_user_id = $1
    `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading claimed items:", err);
    res.status(500).json({ error: "Failed to load claimed items" });
  }
});

export default router;
