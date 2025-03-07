import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// used to store online users
const userSocketMap = {}; // {userId from db and socketId from socket} This object (userSocketMap) stores the mapping of user IDs from the database to their corresponding socket IDs.

io.on("connection",(socket)=>{ // socket refers to user connected
    console.log("A user connected ",socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) userSocketMap[userId] = socket.id; // {userid: socket.id} This allows the backend to track which user is connected to which socket.

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); //gives an array of online user IDs to frontend

    socket.on("disconnect",()=>{
        console.log("A user disconnected ",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
});



export { app, io, server };
