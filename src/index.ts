import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./shared/global-error-handler.js";
import { connectRedis } from "./config/redis.js";
import { authRouter } from "./API/auth/routers/user.router.js";
import { userSelfRouter } from "./API/user/router/user-self.router.js";
import { teamRouter } from "./API/team/router/team.router.js";
import { teamMemberRouter } from "./API/team-member/router/teamMember.router.js";

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Health Check Route
console.log("url", process.env.DIRECT_URL);
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Belwork API is up and running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("Health: Server instance is healthy");
});

// Routers
app.use("/auth", authRouter);
app.use("/user", userSelfRouter);
app.use("/team", teamRouter);
app.use("/team-member", teamMemberRouter);

// Global Error Handler
app.use(globalErrorHandler);

// Initialize Socket.io with the populated app
// const httpServer = initSocket(app);
const PORT = Number(process.env.SERVER_PORT) || 5000;

// connect redis server in app
await connectRedis();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
