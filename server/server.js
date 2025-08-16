import express from "express";
import cors from "cors";
import { loginUser, registerUser } from "./lib/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Local login route
app.post("/server/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        res.json({ user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// Local register route
app.post("/server/register", async(req, res) => {
    try {
        const { username, full_name, email, password } = req.body;
        const result = await registerUser(username, full_name, email, password);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));