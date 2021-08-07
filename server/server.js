const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
server.listen(4000, () => {
  console.log('listening on port 4000');
});

module.exports = io;
