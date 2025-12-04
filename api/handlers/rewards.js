import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/handlers/rewards - Retrieve all rewards catalog
router.get("/", async (req, res) => {
  try {
    const rewards = await pool.query(
      "SELECT * FROM rewards_catalog ORDER BY points_cost ASC;"
    );
    res.json(rewards.rows);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/handlers/rewards/redeemed-rewards/:userId - Get all redeemed rewards of a user
router.get("/redeemed-rewards/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `
      SELECT rr.redemption_id, rr.redeemed_at, rc.title, rc.description, rc.points_cost, rc.qr_url
      FROM reward_redemptions rr
      JOIN rewards_catalog rc ON rr.reward_id = rc.reward_id
      WHERE rr.user_id = $1
      ORDER BY rr.redeemed_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching redeemed rewards:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/handlers/rewards/user/:id - Retrieve user points balance
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await pool.query(
      "SELECT points FROM users WHERE user_id = $1;",
      [userId]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ points: user.rows[0].points });
  } catch (error) {
    console.error("Error fetching user points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/handlers/rewards/redeem - Redeem a reward
router.post("/redeem", async (req, res) => {
  const { user_id, reward_id } = req.body;
  if (!user_id || !reward_id) {
    return res
      .status(400)
      .json({ error: "User ID and Reward ID are required" });
  }
  try {
    // Check if user has enough points
    const userResult = await pool.query(
      "SELECT points FROM users WHERE user_id = $1",
      [user_id]
    );
    const userPoints = userResult.rows[0].points;

    // Get reward points cost
    const rewardResult = await pool.query(
      "SELECT points_cost FROM rewards_catalog WHERE reward_id = $1",
      [reward_id]
    );
    const rewardPoints = rewardResult.rows[0].points_cost;

    if (userPoints < rewardPoints) {
      return res
        .status(400)
        .json({ error: "Insufficient points to redeem this reward" });
    }

    // Deduct points and record redemption
    await pool.query(
      "UPDATE users SET points = points - $1 WHERE user_id = $2",
      [rewardPoints, user_id]
    );

    await pool.query(
      "INSERT INTO reward_redemptions (user_id, reward_id, redeemed_at) VALUES ($1, $2, NOW())",
      [user_id, reward_id]
    );
    res.json({ message: "Reward redeemed successfully" });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
