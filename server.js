const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Port = process.env.PORT;
const app = express();
app.use(cors());

// HTTP server create
const server = http.createServer(app);

// Socket.io server create
const io = new Server(server, {
  cors: {
    origin: "*"  // development এ সব origin allow, production এ specific ঠিক করা যাবে
  }
});

// Socket connection handle
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Call event
  socket.on("call-user", (data) => {
    io.to(data.to).emit("receive-call", data);
  });

  // Answer event
  socket.on("make-answer", (data) => {
    io.to(data.to).emit("answer-made", data);
  });

  // ICE candidate event
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", data.candidate);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server listen
server.listen(Port, () => {
  console.log("Server running on port 5000");
});