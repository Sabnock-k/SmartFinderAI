import express from "express";
import cors from "cors";
import loginHandler from "./login.js";
import registerHandler from "./register.js";
import forgotPasswordHandler from './forgot-password.js'; // Assuming you handle password reset here
import uploadFoundItemHandler from './found-item.js'; // Assuming you handle item uploads here   

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // allow your frontend URL
    methods: ["GET", "POST"], // allowed HTTP methods
    credentials: true // if you use cookies/auth
}));

app.use(express.json());

app.post("/api/login", loginHandler);
app.post("/api/register", registerHandler);
app.post('/api/forgot-password', forgotPasswordHandler);
app.post("/api/found-item", uploadFoundItemHandler);

app.listen(5000, () => console.log("Server running on port 5000"));