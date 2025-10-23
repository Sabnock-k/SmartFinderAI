import "dotenv/config";
import express from "express";
import cors from "cors";
import loginHandler from "./login.js";
import registerHandler from "./register.js";
import forgotPasswordHandler from "./forgot-password.js";
import updateProfileHandler from "./update-profile.js";
import updatePasswordHandler from "./update-password.js";
import uploadFoundItemHandler from "./found-item.js";
import statsHandler from "./stats.js";

const app = express();

app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Debug endpoint - visit this in your browser
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "CampusFind API is running",
    handlers: {
      loginHandler: typeof loginHandler,
      registerHandler: typeof registerHandler,
      forgotPasswordHandler: typeof forgotPasswordHandler,
      updateProfileHandler: typeof updateProfileHandler,
      updatePasswordHandler: typeof updatePasswordHandler,
      uploadFoundItemHandler: typeof uploadFoundItemHandler,
      statsHandler: typeof statsHandler,
    },
  });
});

// Only mount handlers that are valid functions
if (loginHandler && typeof loginHandler === "function") {
  app.use("/login", loginHandler);
}

if (registerHandler && typeof registerHandler === "function") {
  app.use("/register", registerHandler);
}

if (forgotPasswordHandler && typeof forgotPasswordHandler === "function") {
  app.use("/forgot-password", forgotPasswordHandler);
}

if (updateProfileHandler && typeof updateProfileHandler === "function") {
  app.use("/update-profile", updateProfileHandler);
}

if (updatePasswordHandler && typeof updatePasswordHandler === "function") {
  app.use("/update-password", updatePasswordHandler);
}

if (uploadFoundItemHandler && typeof uploadFoundItemHandler === "function") {
  app.use("/found-item", uploadFoundItemHandler);
}

if (statsHandler && typeof statsHandler === "function") {
  app.use("/stats", statsHandler);
}

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
