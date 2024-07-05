// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/webserviceDb', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// const usersRouter = require('./routes/users')(io); // Pass io instance to router
// app.use('/users', usersRouter);

// // Catch-all route to serve user-list.html
// app.get('/user-list.html', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'user-list.html'));
// });

// // Socket.io handling
// const liveUsers = {};

// io.on('connection', (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   socket.on('userAdded', (user) => {
//     liveUsers[socket.id] = { email: user.email, name: `${user.firstName} ${user.lastName}`, socketId: socket.id };
//     socket.join('Live-users');
//     io.emit('updateUserList', Object.values(liveUsers));
//   });

//   socket.on('disconnect', () => {
//     console.log(`A user disconnected: ${socket.id}`);
//     delete liveUsers[socket.id];
//     io.emit('updateUserList', Object.values(liveUsers));
//   });
// });

// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });

const express = require('express');
const app = express(); // Initialize app before using it
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 
const http = require('http');
const server = http.createServer(app); 
const { Server } = require("socket.io");
const io = new Server(server); 
const liveUsers = {};

const port = 3000; 

// Connect to MongoDB (replace with your actual credentials)
mongoose.connect('mongodb://localhost:27017/webserviceDb', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import the routes
const userRoutes = require('./routes/users'); 
// Use the routes
app.use('/api', userRoutes); // Mount the routes under '/api'

// Socket.IO Connection Handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    //join room event
    socket.on('joinRoom', (userData) => {
        socket.join('live-users');

        liveUsers[socket.id] = {
            emailId: userData.emailId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            socketId: socket.id
        };
      
        io.to('live-users').emit('updateLiveUsers', Object.values(liveUsers));
    });

    
      //reconnect  user event
    socket.on('reconnectUser', (userData) => {
        socket.join('live-users');
        liveUsers[socket.id] = {
            emailId: userData.emailId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            socketId: socket.id
        };
        io.to('live-users').emit('updateLiveUsers', Object.values(liveUsers));
    });

    // Disconnect Event
    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete liveUsers[socket.id];
        io.to('live-users').emit('updateLiveUsers', Object.values(liveUsers));
    });
   
    socket.on('disconnectUser', () => {
       console.log('User intentionally disconnected');
       delete liveUsers[socket.id];
       io.to('live-users').emit('updateLiveUsers', Object.values(liveUsers));
   });
});

// app.get('/user-list.html', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'user-list.html'));
// });

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});