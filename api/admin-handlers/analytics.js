import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/analytics - Comprehensive analytics dashboard
router.get("/", async (req, res) => {
  try {
    // Total Users
    const usersResult = await pool.query(
      "SELECT COUNT(*) AS user_count FROM users;"
    );

    // Users registered in last 30 days
    const recentUsersResult = await pool.query(
      "SELECT COUNT(*) AS recent_count FROM users WHERE created_at >= NOW() - INTERVAL '30 days';"
    );

    // Approved items (active listings)
    const approvedItemsResult = await pool.query(
      "SELECT COUNT(*) AS approved_count FROM found_items WHERE is_approved = TRUE;"
    );

    // Pending approvals
    const pendingApprovalsResult = await pool.query(
      "SELECT COUNT(*) AS pending_count FROM found_items WHERE is_approved = FALSE;"
    );

    // Reunited items
    const reunitedItemsResult = await pool.query(
      "SELECT COUNT(*) AS reunited_count FROM found_items WHERE reunited = TRUE;"
    );

    // Total claim requests
    const claimRequestsResult = await pool.query(
      "SELECT COUNT(*) AS total_claims FROM claim_requests;"
    );

    // Pending claim requests
    const pendingClaimsResult = await pool.query(
      "SELECT COUNT(*) AS pending_claims FROM claim_requests WHERE status = 'pending';"
    );

    // Approved claim requests
    const approvedClaimsResult = await pool.query(
      "SELECT COUNT(*) AS approved_claims FROM claim_requests WHERE admin_approved = TRUE;"
    );

    // Total reward redemptions
    const redemptionsResult = await pool.query(
      "SELECT COUNT(*) AS total_redemptions FROM reward_redemptions;"
    );

    // Recent redemptions (last 30 days)
    const recentRedemptionsResult = await pool.query(
      "SELECT COUNT(*) AS recent_redemptions FROM reward_redemptions WHERE redeemed_at >= NOW() - INTERVAL '30 days';"
    );

    // Total points distributed
    const totalPointsResult = await pool.query(
      "SELECT COALESCE(SUM(points), 0) AS total_points FROM users;"
    );

    // Items by category (top 5)
    const categoryStatsResult = await pool.query(
      `SELECT category, COUNT(*) AS count 
       FROM found_items 
       WHERE category IS NOT NULL 
       GROUP BY category 
       ORDER BY count DESC 
       LIMIT 5;`
    );

    // Items added in last 30 days
    const recentItemsResult = await pool.query(
      "SELECT COUNT(*) AS recent_items FROM found_items WHERE created_at >= NOW() - INTERVAL '30 days';"
    );

    // Average response time (days between item found and claimed)
    const avgResponseTimeResult = await pool.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (cr.requested_at - fi.created_at)) / 86400) AS avg_days
       FROM claim_requests cr
       JOIN found_items fi ON cr.found_item_id = fi.found_item_id
       WHERE cr.status = 'approved';`
    );

    // Success rate (reunited items / total approved items)
    const totalApproved = parseInt(
      approvedItemsResult.rows[0].approved_count,
      10
    );
    const totalReunited = parseInt(
      reunitedItemsResult.rows[0].reunited_count,
      10
    );
    const successRate =
      totalApproved > 0
        ? ((totalReunited / totalApproved) * 100).toFixed(1)
        : 0;

    // Top contributors (users with most found items)
    const topContributorsResult = await pool.query(
      `SELECT u.username, u.full_name, COUNT(fi.found_item_id) AS items_found, u.points
       FROM users u
       JOIN found_items fi ON u.user_id = fi.reported_by_user_id
       WHERE fi.is_approved = TRUE
       GROUP BY u.user_id, u.username, u.full_name, u.points
       ORDER BY items_found DESC
       LIMIT 5;`
    );

    // Recent activity (last 7 days item submissions)
    const activityLast7DaysResult = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS items
       FROM found_items
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC;`
    );

    // Status breakdown of all items
    const statusBreakdownResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM found_items
       GROUP BY status;`
    );

    // Prepare response
    res.json({
      // Core metrics
      userCount: parseInt(usersResult.rows[0].user_count, 10),
      recentUsers: parseInt(recentUsersResult.rows[0].recent_count, 10),
      approvedCount: totalApproved,
      pendingCount: parseInt(pendingApprovalsResult.rows[0].pending_count, 10),
      reunitedCount: totalReunited,

      // Claim metrics
      totalClaims: parseInt(claimRequestsResult.rows[0].total_claims, 10),
      pendingClaims: parseInt(pendingClaimsResult.rows[0].pending_claims, 10),
      approvedClaims: parseInt(
        approvedClaimsResult.rows[0].approved_claims,
        10
      ),

      // Reward metrics
      totalRedemptions: parseInt(
        redemptionsResult.rows[0].total_redemptions,
        10
      ),
      recentRedemptions: parseInt(
        recentRedemptionsResult.rows[0].recent_redemptions,
        10
      ),
      totalPointsDistributed: parseInt(
        totalPointsResult.rows[0].total_points,
        10
      ),

      // Item metrics
      recentItems: parseInt(recentItemsResult.rows[0].recent_items, 10),
      categoryStats: categoryStatsResult.rows,
      statusBreakdown: statusBreakdownResult.rows,

      // Performance metrics
      successRate: parseFloat(successRate),
      avgResponseTimeDays: avgResponseTimeResult.rows[0].avg_days
        ? parseFloat(avgResponseTimeResult.rows[0].avg_days).toFixed(1)
        : 0,

      // Leaderboard
      topContributors: topContributorsResult.rows,

      // Activity timeline
      recentActivity: activityLast7DaysResult.rows,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

export default router;
