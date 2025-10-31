import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Handlers
import loginHandler from "./handlers/login.js";
import registerHandler from "./handlers/register.js";
import forgotPasswordHandler from "./handlers/forgot-password.js";
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

// Get correct directory paths (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use("/api/items", ItemsHandler);
app.use("/api/stats", statsHandler);

// Admin routes
app.use("/api/admin/users", getUsersHandler);
app.use("/api/admin/users/:id", getUsersHandler);
app.use("/api/admin/reported-items", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/approve", getReportedItemsHandler);
app.use("/api/admin/reported-items/:id/reject", getReportedItemsHandler);
app.use("/api/admin/approved-items", getApprovedItemsHandler);
app.use("/api/admin/approved-items/:id", getApprovedItemsHandler);

// --- FRONTEND (Vite Build) ---
if (isProduction) {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));

  // For React Router (SPA) support
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Local dev server
  app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
  );
}

export default app;
