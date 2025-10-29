import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

// GET /api/admin/users - Retrieve all users
router.get("/", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT * FROM users WHERE is_admin = false ORDER BY created_at DESC;"
    );
    res.json(users.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *;",
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
