import express, { json } from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import { protect } from "./middlewares/roleProtect.js";
import secUserRoutes from "./routes/secUser.js";
import leadRoutes from "./routes/lead.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import associateRoutes from "./routes/associate.routes.js";
import analystRoutes from "./routes/analyst.routes.js";
import { Server } from "socket.io";
import notifiactionRoutes from "./routes/notification.routes.js";

config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://vsgoi-lead-client.vercel.app",
  "https://vsgoi-lead-client-isski3wi0-hitechs-projects-ab108f9f.vercel.app",
  process.env.CLIENT_URL, 
].filter((origin): origin is string => Boolean(origin));

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(cookieParser());
app.use(json());

connectDB();

app.get("/", (req, res) => {
  res.send("VSGOI_-LEAD");
});

app.use("/api/secUser", secUserRoutes);
app.use("/api/lead", leadRoutes);
app.use("/api/admin", protect, adminRoutes);
app.use("/api/analyst", protect, analystRoutes);
app.use("/api/associate", protect, associateRoutes);
app.use("/api/notifications", notifiactionRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: { 
    origin: allowedOrigins, 
    credentials: true 
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket: any) => {
  console.log("Socket connected:", socket.id);
  socket.on("join", (userId: any) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
