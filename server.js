const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  }
});

app.get("/", (req, res) => {
  res.send("Server läuft!");
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", room => {
    socket.join(room);
    socket.to(room).emit("user-connected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server läuft auf Port 3000");
});