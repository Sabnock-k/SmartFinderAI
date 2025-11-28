import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/users - Retrieve all users with comprehensive statistics
router.get("/", async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.email,
        u.facebook_account_link,
        u.points,
        u.is_admin,
        u.created_at,
        COUNT(DISTINCT fi.found_item_id) as items_reported,
        COUNT(DISTINCT rr.redemption_id) as total_redemptions,
        COUNT(DISTINCT CASE WHEN fi.reunited = true THEN fi.found_item_id END) as items_reunited,
        COUNT(DISTINCT cr.claim_request_id) as total_claims
      FROM users u
      LEFT JOIN found_items fi ON u.user_id = fi.reported_by_user_id
      LEFT JOIN reward_redemptions rr ON u.user_id = rr.user_id
      LEFT JOIN claim_requests cr ON u.user_id = cr.requested_by_user_id
      WHERE u.is_admin = false
      GROUP BY u.user_id, u.username, u.full_name, u.email, u.facebook_account_link, u.points, u.is_admin, u.created_at
      ORDER BY u.created_at DESC;
    `);

    res.json(users.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/users/:id - Get detailed information about a specific user
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Get user basic info with stats
    const userResult = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.full_name,
        u.email,
        u.facebook_account_link,
        u.points,
        u.is_admin,
        u.created_at,
        COUNT(DISTINCT fi.found_item_id) as items_reported,
        COUNT(DISTINCT rr.redemption_id) as total_redemptions,
        COUNT(DISTINCT CASE WHEN fi.reunited = true THEN fi.found_item_id END) as items_reunited
      FROM users u
      LEFT JOIN found_items fi ON u.user_id = fi.reported_by_user_id
      LEFT JOIN reward_redemptions rr ON u.user_id = rr.user_id
      WHERE u.user_id = $1
      GROUP BY u.user_id;
    `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's recent items
    const itemsResult = await pool.query(
      `
      SELECT 
        found_item_id,
        description,
        category,
        location_description,
        date_time_found,
        is_approved,
        reunited,
        status
      FROM found_items
      WHERE reported_by_user_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
    `,
      [userId]
    );

    // Get user's redemptions
    const redemptionsResult = await pool.query(
      `
      SELECT 
        rr.redemption_id,
        rr.redeemed_at,
        rc.title,
        rc.description,
        rc.points_cost
      FROM reward_redemptions rr
      JOIN rewards_catalog rc ON rr.reward_id = rc.reward_id
      WHERE rr.user_id = $1
      ORDER BY rr.redeemed_at DESC
      LIMIT 10;
    `,
      [userId]
    );

    res.json({
      user: userResult.rows[0],
      recentItems: itemsResult.rows,
      recentRedemptions: redemptionsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/users/stats/summary - Get overall user statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.user_id) as total_users,
        SUM(u.points) as total_points,
        COUNT(DISTINCT fi.found_item_id) as total_items_reported,
        COUNT(DISTINCT rr.redemption_id) as total_redemptions,
        COUNT(DISTINCT CASE WHEN fi.reunited = true THEN fi.found_item_id END) as total_items_reunited,
        AVG(u.points)::INTEGER as avg_points_per_user
      FROM users u
      LEFT JOIN found_items fi ON u.user_id = fi.reported_by_user_id
      LEFT JOIN reward_redemptions rr ON u.user_id = rr.user_id
      WHERE u.is_admin = false;
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 AND is_admin = false RETURNING *;",
      [userId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "User not found or cannot delete admin users" });
    }

    res.json({
      message: "User deleted successfully",
      deletedUser: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
