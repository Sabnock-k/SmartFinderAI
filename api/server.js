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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Debug logs
console.log("Handler types:");
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

app.use("/api/login", loginHandler);
app.use("/api/register", registerHandler);
app.use("/api/forgot-password", forgotPasswordHandler);
app.use("/api/update-profile", updateProfileHandler);
app.use("/api/update-password", updatePasswordHandler);
app.use("/api/found-item", uploadFoundItemHandler);
app.use("/api/stats", statsHandler);

export default app;
