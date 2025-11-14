// routes/claim-item.js
import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { found_item_id, requested_by_user_id } = req.body;

  if (!found_item_id || !requested_by_user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert claim attempt
    await pool.query(
      `INSERT INTO claim_requests (found_item_id, requested_by_user_id)
       VALUES ($1, $2)`,
      [found_item_id, requested_by_user_id]
    );

    // Update item status
    await pool.query(
      `UPDATE found_items
       SET status = 'A person is attempting to claim'
       WHERE found_item_id = $1`,
      [found_item_id]
    );

    // Get founder and claimer info
    const [itemResult, claimerResult] = await Promise.all([
      pool.query(
        `SELECT reported_by_user_id, description FROM found_items WHERE found_item_id = $1`,
        [found_item_id]
      ),
      pool.query(
        `SELECT full_name, email, facebook_account_link FROM users WHERE user_id = $1`,
        [requested_by_user_id]
      ),
    ]);

    if (itemResult.rows.length === 0 || claimerResult.rows.length === 0) {
      return res.status(404).json({ error: "Item or user not found" });
    }

    const founderId = itemResult.rows[0].reported_by_user_id;
    const itemDescription = itemResult.rows[0].description;
    const claimer = claimerResult.rows[0];

    // 🔹 4. Create a clean, clickable notification
    const message = `
      ${claimer.full_name} is attempting to claim your found item: 
      ${itemDescription}.
      📧 Email: ${claimer.email || "Not provided"}
      🔗 Facebook: ${claimer.facebook_account_link || "Not provided"}
    `;

    await pool.query(
      `INSERT INTO notifications (recipient_user_id, found_item_id, message)
       VALUES ($1, $2, $3)`,
      [founderId, found_item_id, message]
    );

    res.json({ message: "Claim attempt recorded and founder notified" });
  } catch (error) {
    console.error("Error processing claim:", error);
    res.status(500).json({ error: "Failed to process claim attempt" });
  }
});

// PUT /api/claim-item/founder-confirm
router.put("/founder-confirm", async (req, res) => {
  const { itemId } = req.body;
  try {
    await pool.query(
      `UPDATE claim_requests 
       SET founder_confirmed = TRUE, status = 'founder confirmed'
       WHERE found_item_id = $1`,
      [itemId]
    );

    await pool.query(
      `UPDATE found_items 
      SET status = 'founder confirmed'
      WHERE found_item_id = $1`,
      [itemId]
    );

    res.json({ message: "Founder confirmed return" });
  } catch (err) {
    console.error("Error confirming by founder:", err);
    res.status(500).json({ error: "Failed to confirm" });
  }
});

// PUT /api/claim-item/:claimId/claimer-confirm
router.put("/:claimId/claimer-confirm", async (req, res) => {
  const { claimId } = req.params;
  try {
    await pool.query(
      `UPDATE claim_requests 
       SET claimer_confirmed = TRUE, status = 'claimer confirmed'
       WHERE claim_request_id = $1`,
      [claimId]
    );

    // get the found_item_id from the claim_requests
    const result = await pool.query(
      `SELECT found_item_id FROM claim_requests WHERE claim_request_id = $1`,
      [claimId]
    );

    const itemId = result.rows[0].found_item_id;

    await pool.query(
      `UPDATE found_items 
      SET status = 'claimer confirmed'
      WHERE found_item_id = $1`,
      [itemId]
    );

    res.json({ message: "Claimer confirmed item return" });
  } catch (err) {
    console.error("Error confirming by claimer:", err);
    res.status(500).json({ error: "Failed to confirm claim" });
  }
});

export default router;
