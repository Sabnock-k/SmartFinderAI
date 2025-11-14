// routes/found-item.js
import express from "express";
import pool from "../utils/db.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ⚙️ Helper: create embedding from description, location, date
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

    // 🔹 Generate embedding
    const embedding = await getEmbedding(
      description,
      location_description,
      date_time_found
    );

    const vectorLiteral = `[${embedding.join(",")}]`;

    // 🔹 Insert into DB with embedding
    const result = await pool.query(
      `INSERT INTO found_items 
         (reported_by_user_id, description, category, image_url, location_description, date_time_found, embedding) 
         VALUES ($1, $2, $3, $4, $5, $6, $7::vector)
         RETURNING *`,
      [
        reported_by_user_id,
        description,
        category || null,
        image_url || null,
        location_description || null,
        date_time_found,
        vectorLiteral,
      ]
    );

    res.status(201).json({
      message: "Found item uploaded successfully!",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error inserting found item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
