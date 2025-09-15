import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/health", (req, res) => {
  res.send("OK");
});

io.on("connection", (socket) => {
  socket.on("chat message", (data) => {
    console.log(data);
    socket.broadcast.to(data.room).emit("chat message", data);
  });

  socket.on("join room", (data) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
        console.log("User left room: " + room);
      }
    }
    console.log(data);
    socket.join(data.room);

    console.log("User joined room: " + data.room + ", " + data.name);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
