import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Paths (keep static)
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

const load = (path) => async (req, res, next) => {
  const module = await import(path);
  return module.default(req, res, next);
};

// User routes
app.use("/api/login", load("./handlers/login.js"));
app.use("/api/register", load("./handlers/register.js"));
app.use("/api/forgot-password", load("./handlers/forgot-password.js"));
app.use("/api/update-profile", load("./handlers/update-profile.js"));
app.use("/api/update-password", load("./handlers/update-password.js"));
app.use("/api/found-item", load("./handlers/found-item.js"));
app.use("/api/search-items", load("./handlers/search-items.js"));
app.use("/api/notifications", load("./handlers/notification.js"));
app.use("/api/items", load("./handlers/items.js"));
app.use("/api/claim-item", load("./handlers/claim-item.js"));
app.use("/api/stats", load("./handlers/stats.js"));
app.use("/api/rewards", load("./handlers/rewards.js"));
app.use("/api/founder-info", load("./handlers/founder-info.js"));

// Admin routes
app.use(
  "/api/admin/update-password",
  load("./admin-handlers/update-password.js")
);
app.use("/api/admin/analytics", load("./admin-handlers/analytics.js"));
app.use("/api/admin/users", load("./admin-handlers/users.js"));
app.use("/api/admin/users/:id", load("./admin-handlers/users.js"));
app.use(
  "/api/admin/reported-items",
  load("./admin-handlers/reported-items.js")
);
app.use(
  "/api/admin/reported-items/:id/approve",
  load("./admin-handlers/reported-items.js")
);
app.use(
  "/api/admin/reported-items/:id/reject",
  load("./admin-handlers/reported-items.js")
);
app.use(
  "/api/admin/approved-items",
  load("./admin-handlers/approved-items.js")
);

if (!isProduction) {
  app.listen(5000, () =>
    console.log("Server running at http://localhost:5000")
  );
}

export default app;
