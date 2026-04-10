const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

// NAF kompatibler Server
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);

    const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
    socket.emit('connectSuccess', { joinedTime: Date.now(), clients });

    socket.to(room).emit('clientConnected', { clientId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('clientDisconnected', { clientId: socket.id });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server läuft auf Port 3000');
});
