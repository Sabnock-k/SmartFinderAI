import pool from "./utils/db.js";

export default async function handler(req, res) {
    if (req.method === "POST") {
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
                    error: "reported_by_user_id, description, and date_time_found are required",
                });
            }

            const result = await pool.query(
                `INSERT INTO found_items 
          (reported_by_user_id, description, category, image_url, location_description, date_time_found) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, [
                    reported_by_user_id,
                    description,
                    category || null,
                    image_url || null,
                    location_description || null,
                    date_time_found,
                ]
            );

            return res.status(201).json({
                message: "Found item uploaded successfully!",
                item: result.rows[0],
            });
        } catch (err) {
            console.error("Error inserting found item:", err);
            return res.status(500).json({ error: "Server error" });
        }
    }

    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `SELECT f.*, u.username 
         FROM found_items f
         JOIN users u ON f.reported_by_user_id = u.id
         ORDER BY f.created_at DESC`
            );
            return res.status(200).json(result.rows);
        } catch (err) {
            console.error("Error fetching found items:", err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}