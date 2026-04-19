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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(json());

connectDB();

app.use("/api/secUser", secUserRoutes);
app.use("/api/lead", leadRoutes);
app.use("/api/admin", protect, adminRoutes);
app.use("/api/analyst", protect, analystRoutes);
app.use("/api/associate", protect, associateRoutes);
app.use("/api/notifications", notifiactionRoutes);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.on("connection", (socket: any) => {
  socket.on("join", (userId: any) => {
    socket.join(userId);
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
