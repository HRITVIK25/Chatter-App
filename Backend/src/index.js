import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from '../routes/message.routes.js'

const app = express();
const PORT = process.env.PORT;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //alows cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server running at port: " + PORT);
  connectDB();
});
