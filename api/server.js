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

// Debug: Check if handlers are loaded correctly
console.log("loginHandler:", typeof loginHandler, loginHandler);
console.log("registerHandler:", typeof registerHandler, registerHandler);
console.log(
  "forgotPasswordHandler:",
  typeof forgotPasswordHandler,
  forgotPasswordHandler
);
console.log(
  "updateProfileHandler:",
  typeof updateProfileHandler,
  updateProfileHandler
);
console.log(
  "updatePasswordHandler:",
  typeof updatePasswordHandler,
  updatePasswordHandler
);
console.log(
  "uploadFoundItemHandler:",
  typeof uploadFoundItemHandler,
  uploadFoundItemHandler
);
console.log("statsHandler:", typeof statsHandler, statsHandler);

const app = express();

app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "CampusFind API is running" });
});

// Conditionally mount only valid handlers
if (loginHandler && typeof loginHandler === "function") {
  app.use("/login", loginHandler);
} else {
  console.error("loginHandler is invalid!");
}

if (registerHandler && typeof registerHandler === "function") {
  app.use("/register", registerHandler);
} else {
  console.error("registerHandler is invalid!");
}

if (forgotPasswordHandler && typeof forgotPasswordHandler === "function") {
  app.use("/forgot-password", forgotPasswordHandler);
} else {
  console.error("forgotPasswordHandler is invalid!");
}

if (updateProfileHandler && typeof updateProfileHandler === "function") {
  app.use("/update-profile", updateProfileHandler);
} else {
  console.error("updateProfileHandler is invalid!");
}

if (updatePasswordHandler && typeof updatePasswordHandler === "function") {
  app.use("/update-password", updatePasswordHandler);
} else {
  console.error("updatePasswordHandler is invalid!");
}

if (uploadFoundItemHandler && typeof uploadFoundItemHandler === "function") {
  app.use("/found-item", uploadFoundItemHandler);
} else {
  console.error("uploadFoundItemHandler is invalid!");
}

if (statsHandler && typeof statsHandler === "function") {
  app.use("/stats", statsHandler);
} else {
  console.error("statsHandler is invalid!");
}

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
