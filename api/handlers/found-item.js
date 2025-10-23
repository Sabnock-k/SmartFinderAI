import express from "express";
import pool from "../utils/db.js"; // adjust path if needed

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      reported_by_user_id,
      description,
      category,
      image_url,
      location_description,
      date_time_found,
    } = req.body;

    if (!reported_by_user_id || !description || !date_time_found) {
      return res.status(400).json({
        error:
          "reported_by_user_id, description, and date_time_found are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO found_items 
             (reported_by_user_id, description, category, image_url, location_description, date_time_found) 
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
      [
        reported_by_user_id,
        description,
        category || null,
        image_url || null,
        location_description || null,
        date_time_found,
      ]
    );

    res.status(201).json({
      message: "Found item uploaded successfully!",
      item: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
