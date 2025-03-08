import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.routes.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from "../routes/message.routes.js";
import { app, server, io } from "../lib/socket.js";

import path from "path";

const PORT = process.env.PORT;
const __dirname = path.resolve();

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

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../Frontend/dist")));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"))
  });
}

server.listen(PORT, () => {
  console.log("Server running at port: " + PORT);
  connectDB();
}); // built a socket.io server on top of our server
