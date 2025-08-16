import { registerUser } from "../lib/auth.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, full_name, email, password } = req.body;
        const result = await registerUser(username, full_name, email, password);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}