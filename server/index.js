const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    console.log(`Socket ${socket.id} joining room: ${room}`);
    socket.join(room);
  });

  socket.on("message", (data) => {
    console.log(`Message received from ${socket.id}:`, data);
    socket.to(data.room).emit("messageReturn", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
