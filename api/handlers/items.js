import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/items/:user_id - Retrieve all items of the user reported and who attempted to claimed them
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const items = await pool.query(
      `
      SELECT 
        fi.*, 
        cr.founder_confirmed,
        cr.claimer_confirmed,
        cr.admin_approved,
        cr.claim_request_id,
        u.full_name AS claimer_name,
        u.email AS claimer_email,
        u.facebook_account_link AS claimer_facebook
      FROM found_items AS fi 
      LEFT JOIN claim_requests AS cr ON fi.found_item_id = cr.found_item_id
      LEFT JOIN users AS u ON cr.requested_by_user_id = u.user_id
      WHERE fi.reported_by_user_id = $1 
      ORDER BY 
        cr.founder_confirmed DESC,
        cr.claimer_confirmed DESC,
        cr.admin_approved DESC
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
        fi.status,
        u.full_name AS founder_name,
        u.email AS founder_email,
        u.facebook_account_link AS founder_facebook
      FROM claim_requests cr
      JOIN found_items fi ON cr.found_item_id = fi.found_item_id
      JOIN users u ON fi.reported_by_user_id = u.user_id
      WHERE cr.requested_by_user_id = $1
      ORDER BY cr.claim_request_id DESC;
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
