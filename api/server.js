import "dotenv/config";
import express from "express";
import cors from "cors";

// Handlers
import loginHandler from "./handlers/login.js";
import registerHandler from "./handlers/register.js";
import forgotPasswordHandler from "./handlers/forgot-password.js";
import updateProfileHandler from "./handlers/update-profile.js";
import updatePasswordHandler from "./handlers/update-password.js";
import uploadFoundItemHandler from "./handlers/found-item.js";
import searchItemHandler from "./handlers/search-items.js";
import notificationHandler from "./handlers/notification.js";
import itemsHandler from "./handlers/items.js";
import claimItemHandler from "./handlers/claim-item.js";
import statsHandler from "./handlers/stats.js";
import rewardsHandler from "./handlers/rewards.js";
import founderInfoHandler from "./handlers/founder-info.js";

// Admin imports
import updatePasswordHandlerAdmin from "./admin-handlers/update-password.js";
import getAnalyticsHandler from "./admin-handlers/analytics.js";
import getUsersHandler from "./admin-handlers/users.js";
import getReportedItemsHandler from "./admin-handlers/reported-items.js";
import getApprovedItemsHandler from "./admin-handlers/approved-items.js";

const app = express();

const isProduction = true;

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// --- API ROUTES ---
app.use("/api/login", loginHandler);
app.use("/api/register", registerHandler);
app.use("/api/forgot-password", forgotPasswordHandler);
app.use("/api/update-profile", updateProfileHandler);
app.use("/api/update-password", updatePasswordHandler);
app.use("/api/found-item", uploadFoundItemHandler);
app.use("/api/search-items", searchItemHandler);
app.use("/api/notifications", notificationHandler);
app.use("/api/items", itemsHandler);
app.use("/api/claim-item", claimItemHandler);
app.use("/api/stats", statsHandler);
app.use("/api/rewards", rewardsHandler);
app.use("/api/founder-info", founderInfoHandler);

// Admin routes
app.use("/api/admin/update-password", updatePasswordHandlerAdmin);
app.use("/api/admin/analytics", getAnalyticsHandler);
app.use("/api/admin/users", getUsersHandler);
app.use("/api/admin/users/:id", getUsersHandler);
app.use("/api/admin/reported-items", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/approve", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/reject", getReportedItemsHandler);
app.use("/api/admin/approved-items", getApprovedItemsHandler);

if (!isProduction) {
  app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
  );
}

export default app;
