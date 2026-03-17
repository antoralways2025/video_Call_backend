const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store users
const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // save user
  users[socket.id] = socket.id;

  // CALL USER
  socket.on("call-user", (data) => {
    io.to(data.to).emit("receive-call", {
      from: socket.id,
      offer: data.offer,
    });
  });

  // ANSWER CALL
  socket.on("make-answer", (data) => {
    io.to(data.to).emit("answer-made", {
      from: socket.id,
      answer: data.answer,
    });
  });

  // ICE CANDIDATE
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});