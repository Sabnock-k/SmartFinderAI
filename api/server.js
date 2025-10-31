import "dotenv/config";
import express from "express";
import cors from "cors";
import loginHandler from "./handlers/login.js";
import registerHandler from "./handlers/register.js";
import forgotPasswordHandler from "./handlers/forgot-password.js"; // Assuming you handle password reset here
import updateProfileHandler from "./handlers/update-profile.js";
import updatePasswordHandler from "./handlers/update-password.js";
import uploadFoundItemHandler from "./handlers/found-item.js";
import ItemsHandler from "./handlers/items.js";
import statsHandler from "./handlers/stats.js";

// Admin imports
import getUsersHandler from "./admin-handlers/users.js";
import getReportedItemsHandler from "./admin-handlers/reported-items.js";
import getApprovedItemsHandler from "./admin-handlers/approved-items.js";

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

app.use("/api/login", loginHandler);
app.use("/api/register", registerHandler);
app.use("/api/forgot-password", forgotPasswordHandler);
app.use("/api/update-profile", updateProfileHandler);
app.use("/api/update-password", updatePasswordHandler);
app.use("/api/found-item", uploadFoundItemHandler);
app.use("/api/items", ItemsHandler);
app.use("/api/stats", statsHandler);

// Admin routes
// users
app.use("/api/admin/users", getUsersHandler);
app.use("/api/admin/users/:id", getUsersHandler);
// items
app.use("/api/admin/reported-items", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/approve", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/reject", getReportedItemsHandler);
app.use("/api/admin/approved-items", getApprovedItemsHandler);
app.use("/api/admin/approved-items/:id", getApprovedItemsHandler);

if (!isProduction) {
  app.listen(5000, () => console.log("Server running on port 5000"));
}
// Export the Express app for Vercel
export default app;
