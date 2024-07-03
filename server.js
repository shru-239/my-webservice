const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const usersInRoom = {};

mongoose.connect('mongodb://localhost:27017/webserviceDb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// Socket.io handling
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('joinRoom', (userData) => {
    usersInRoom[socket.id] = {
      email: userData.email,
      name: userData.name,
      socketId: socket.id
    };

    console.log('User joining room:', userData);
    console.log('Users in room:', usersInRoom);

    socket.join('Live-users');

    // Emit updated user list to all clients in the room
    io.to('Live-users').emit('updateUserList', usersInRoom);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    delete usersInRoom[socket.id];

    // Emit updated user list to all clients in the room
    io.to('Live-users').emit('updateUserList', usersInRoom);
  });
});

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001/');
});
