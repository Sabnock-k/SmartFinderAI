import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/number of users, activer listings(approved items), pending approvals (reported items)
router.get("/", async (req, res) => {
  try {
    const usersResult = await pool.query(
      "SELECT COUNT(*) AS user_count FROM users;"
    );
    const approvedItemsResult = await pool.query(
      "SELECT COUNT(*) AS approved_count FROM found_items WHERE is_approved = 'TRUE';"
    );
    const pendingApprovalsResult = await pool.query(
      "SELECT COUNT(*) AS pending_count FROM found_items WHERE is_approved = 'FALSE';"
    );

    res.json({
      userCount: parseInt(usersResult.rows[0].user_count, 10),
      approvedCount: parseInt(approvedItemsResult.rows[0].approved_count, 10),
      pendingCount: parseInt(pendingApprovalsResult.rows[0].pending_count, 10),
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
