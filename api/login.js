import { loginUser } from "../lib/auth.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}