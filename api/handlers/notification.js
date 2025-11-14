import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/notifications/:userId - Get all notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        n.notification_id,
        n.message,
        n.created_at,
        n.found_item_id,
        fi.description AS item_description,
        fi.image_url AS item_image,
        fi.location_description AS location,
        fi.date_time_found AS date_found,
        fi.category,
        u.username AS finder_username,
        u.full_name AS finder_name
        FROM notifications n
        LEFT JOIN found_items fi ON n.found_item_id = fi.found_item_id
        LEFT JOIN users u ON fi.reported_by_user_id = u.user_id
        WHERE n.recipient_user_id = $1
        ORDER BY n.created_at DESC`,
      [userId]
    );

    res.json({ notifications: result.rows });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /api/notifications/:userId/count - Get unread notification count
router.get("/:userId/count", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT COUNT(*) as count
      FROM notifications
      WHERE recipient_user_id = $1`,
      [userId]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({ error: "Failed to fetch notification count" });
  }
});

// DELETE /api/notifications/:notificationId - Delete a specific notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    await pool.query("DELETE FROM notifications WHERE notification_id = $1", [
      notificationId,
    ]);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// DELETE /api/notifications/clear/:userId - Clear all notifications for a user
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await pool.query("DELETE FROM notifications WHERE recipient_user_id = $1", [
      userId,
    ]);

    res.json({ message: "All notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

// POST /api/notifications - Create a new notification
router.post("/", async (req, res) => {
  try {
    const { recipient_user_id, found_item_id, message } = req.body;

    if (!recipient_user_id || !found_item_id || !message) {
      return res.status(400).json({
        error:
          "Missing required fields: recipient_user_id, found_item_id, message",
      });
    }

    const result = await pool.query(
      `INSERT INTO notifications (recipient_user_id, found_item_id, message)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [recipient_user_id, found_item_id, message]
    );

    res.status(201).json({
      message: "Notification created successfully",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

export default router;
