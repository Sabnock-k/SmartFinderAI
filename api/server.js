import express from "express";
import loginHandler from "./login.js";
import registerHandler from "./register.js";

const app = express();

app.use(express.json());

app.post("/api/login", loginHandler);
app.post("/api/register", registerHandler);

app.listen(5000, () => console.log("Server running on port 5000"));