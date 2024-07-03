// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');
// const http = require('http');
// const socketIo = require('socket.io');
// const usersRouter = require('./routes/users');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
// const port = 3001;

// let usersInRoom = {};

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/webserviceDb', { useNewUrlParser: true, useUnifiedTopology: true });

// // Routes
// app.use('/users', usersRouter);

// // Serve the index.html file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Serve the user list HTML file
// app.get('/user-list', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'user-list.html'));
// });

// // Handle Socket.io connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('joinRoom', (user) => {
//     if (!usersInRoom[socket.id]) {
//       usersInRoom[socket.id] = { ...user, socketId: socket.id };
//       socket.join('userRoom');
//       io.to('userRoom').emit('updateUserList', Object.values(usersInRoom));
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//     if (usersInRoom[socket.id]) {
//       delete usersInRoom[socket.id];
//       io.to('userRoom').emit('updateUserList', Object.values(usersInRoom));
//     }
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');
// const http = require('http');
// const socketIo = require('socket.io');
// const usersRouter = require('./routes/users');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);
// const port = 3001;
// const usersInRoom = {};

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/webserviceDb');

// // Import User model
// const User = require('./models/user');

// // Routes
// app.use('/users', usersRouter);

// // Serve the index.html file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Serve the user list HTML file
// app.get('/user-list', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'user-list.html'));
// });

// // Handle Socket.io connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('joinRoom', async (user) => {
//     console.log('User joining room:', user);

//     try {
//       // Insert user data into MongoDB if not already present
//       let dbUser = await User.findOne({ email: user.email }).exec();
//       if (!dbUser) {
//         dbUser = new User({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           mobileNo: user.mobileNo,
//           email: user.email,
//           address: user.address,
//           loginId: user.loginId,
//           password: user.password,
//           creationTime: new Date(),
//           lastUpdatedOn: new Date()
//         });
//         await dbUser.save();
//       }

//       // Join user to room
//       socket.join('Live-users');

//       // Add user to local variable
//       usersInRoom[socket.id] = { email: user.email, name: user.firstName + ' ' + user.lastName, socketId: socket.id };
//       console.log('Users in room:', usersInRoom);

//       // Emit event to update client-side list
//       io.to('Live-users').emit('updateUserList', Object.values(usersInRoom));
//     } catch (error) {
//       console.error('Error handling joinRoom:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//     if (usersInRoom[socket.id]) {
//       delete usersInRoom[socket.id];
//       io.to('Live-users').emit('updateUserList', Object.values(usersInRoom));
//     }
//   });
// });

// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });


const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const usersInRoom = {};

mongoose.connect('mongodb://localhost:27017/webserviceDb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: String,
  email: { type: String, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
  },
  loginId: String,
  password: String,
});

const User = mongoose.model('users', userSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);

    io.emit('userJoined', {
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      socketId: null // Will be set when the user connects with socket.io
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    console.log(`Fetching user with email: ${req.params.email}`);
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      console.log(`User not found: ${req.params.email}`);
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send(error);
  }
});

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

