// routes/search-items.js
import express from "express";
import pool from "../utils/db.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ⚙️ Helper: generate embedding from user query
async function getEmbedding(query) {
  const cleaned = query.trim().toLowerCase().slice(0, 500);
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: cleaned,
  });
  return response.data[0].embedding;
}

router.post("/", async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Search query required" });
    }

    //  Generate embedding for query
    const embedding = await getEmbedding(query);

    const vectorLiteral = `[${embedding.join(",")}]`;

    //  Find top 10 similar items using cosine similarity
    const result = await pool.query(
      `
      SELECT 
        reported_by_user_id,
        found_item_id AS item_id,
        description,
        category,
        image_url,
        location_description,
        date_time_found,
        is_approved,
        status,
        1 - (embedding <=> $2) AS match_score
      FROM found_items
      WHERE is_approved = true AND reported_by_user_id != $1
      ORDER BY embedding <=> $2
      LIMIT 10;
      `,
      [userId, vectorLiteral]
    );

    res.json({ results: result.rows });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
