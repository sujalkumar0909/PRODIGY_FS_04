const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

let users = [];

io.on('connection', (socket) => {
  console.log('a new client connected');

  socket.on('new-user', (name) => {
    users.push({ id: socket.id, name });
    console.log(`new user: ${name}`);
    io.emit('users-update', users);
  });

  socket.on('user-message', (message) => {
    console.log(`message from ${message.name}: ${message.text}`);
    io.emit('message', message);
  });

  socket.on('private-message', (message) => {
    console.log(`private message from ${message.from} to ${message.to}: ${message.text}`);
    io.to(message.to).emit('private-message', message);
  });

  socket.on('disconnect', () => {
    console.log('a client disconnected');
    users = users.filter((user) => user.id !== socket.id);
    io.emit('users-update', users);
  });
});

server.listen(3000, () => {
  console.log('server listening on port 3000');
});