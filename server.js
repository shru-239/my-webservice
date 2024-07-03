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

  socket.on('joinRoom', async (userData) => {
    // Join the user to the "Live-users" room
    socket.join('Live-users');

    // Store user details in local variable
    usersInRoom[socket.id] = {
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      socketId: socket.id
    };

    // Emit updated user list to all clients in the room
    io.to('Live-users').emit('updateUserList', Object.values(usersInRoom));
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    delete usersInRoom[socket.id];

    // Emit updated user list to all clients in the room
    io.to('Live-users').emit('updateUserList', Object.values(usersInRoom));
  });

});


server.listen(3001, () => {
  console.log('Server running at http://localhost:3001/');
});
