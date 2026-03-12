const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Caller sends offer
  socket.on("call-user", (data) => {
    // data = { to: id, from: id, offer: {type, sdp} }
    io.to(data.to).emit("receive-call", data);
  });

  // Receiver sends answer
  socket.on("make-answer", (data) => {
    io.to(data.to).emit("answer-made", data);
  });

  // ICE candidates
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});