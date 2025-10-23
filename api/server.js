import "dotenv/config";
import express from "express";
import cors from "cors";
import loginHandler from "./login.js";
import registerHandler from "./register.js";
import forgotPasswordHandler from "./forgot-password.js"; // Assuming you handle password reset here
import updateProfileHandler from "./update-profile.js";
import updatePasswordHandler from "./update-password.js";
import uploadFoundItemHandler from "./found-item.js"; // Assuming you handle item uploads here
import statsHandler from "./stats.js";

const app = express();
const isProduction = true; // Change to true when deploying to production

app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
    credentials: true, // if you use cookies/auth
  })
);

app.use(express.json());

app.use("/login", loginHandler);
app.use("/register", registerHandler);
app.use("/forgot-password", forgotPasswordHandler);
app.use("/update-profile", updateProfileHandler);
app.use("/update-password", updatePasswordHandler);
app.use("/found-item", uploadFoundItemHandler);
app.use("/stats", statsHandler);

if (!isProduction) {
  app.listen(5000, () => console.log("Server running on port 5000"));
}
// Export the Express app for Vercel
export default app;
