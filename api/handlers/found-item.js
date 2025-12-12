// routes/found-item.js
import express from "express";
import pool from "../utils/db.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: create embedding from description, location, date
async function getEmbedding(description, location, dateTimeFound) {
  const text = `${description.trim()} | Location: ${location || ""} | Date: ${
    dateTimeFound || ""
  }`;
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });
  return response.data[0].embedding; // returns array of numbers
}

//Helper: function to check auto-approve setting
async function shouldAutoApprove() {
  try {
    const result = await pool.query(
      "SELECT auto_approve FROM system_settings WHERE id = 1"
    );

    if (result.rows.length === 0) {
      return false; // Default to manual approval
    }

    return result.rows[0].auto_approve;
  } catch (error) {
    console.error("Error checking auto-approve setting:", error);
    return false; // Default to manual approval on error
  }
}

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

    // check if user has a facebook account
    const userResult = await pool.query(
      "SELECT facebook_account_link FROM users WHERE user_id = $1",
      [reported_by_user_id]
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    if (!user.facebook_account_link) {
      return res.status(400).json({
        error: "You must link your Facebook account to report found items.",
      });
    }

    //  Generate embedding
    const embedding = await getEmbedding(
      description,
      location_description,
      date_time_found
    );

    const vectorLiteral = `[${embedding.join(",")}]`;

    // Check if auto-approve is enabled
    const autoApprove = await shouldAutoApprove();

    //  Insert into DB with embedding
    const result = await pool.query(
      `INSERT INTO found_items 
         (reported_by_user_id, description, category, image_url, location_description, date_time_found, embedding, is_approved) 
         VALUES ($1, $2, $3, $4, $5, $6, $7::vector, $8)
         RETURNING *`,
      [
        reported_by_user_id,
        description,
        category || null,
        image_url || null,
        location_description || null,
        date_time_found,
        vectorLiteral,
        autoApprove,
      ]
    );

    // If auto-approved, award points immediately
    if (autoApprove) {
      await pool.query(
        "UPDATE users SET points = points + 20 WHERE user_id = $1",
        [reported_by_user_id]
      );

      // Create notification for the user
      await pool.query(
        `INSERT INTO notifications (recipient_user_id, found_item_id, message)
         VALUES ($1, $2, $3)`,
        [
          reported_by_user_id,
          result.rows[0].found_item_id,
          "Your found item has been automatically approved! You earned 20 points.",
        ]
      );

      return res.status(201).json({
        message:
          "Found item uploaded successfully! and has been automatically approved!",
        item: result.rows[0],
      });
    }

    return res.status(201).json({
      message: "Found item uploaded successfully!",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error inserting found item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
