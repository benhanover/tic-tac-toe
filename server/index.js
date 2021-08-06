const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const players = {};
let rival;

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
  // socket.emit('test', 'testtt');
  initializePlayers(socket);

  if (getOpponent(socket)) {
    socket.emit('game begin', {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit('game begin', {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on('make move', (data) => {
    if (!getOpponent(socket)) return;
    socket.emit('move made', data);
    getOpponent(socket).emit('move made', data);
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    if (getOpponent(socket)) {
      getOpponent(socket).emit('opponent left');
    }
  });
});

///////////////////////////////////////////////////////////////////////

function initializePlayers(socket) {
  players[socket.id] = {
    opponent: rival,
    symbol: 'X',
    socket: socket,
  };
  if (rival) {
    players[socket.id].symbol = 'O';
    players[rival].opponent = socket.id;
    rival = null;
  } else {
    rival = socket.id;
  }
}
// **
function getOpponent(socket) {
  if (!players[socket.id]?.opponent) return;
  return players[players[socket.id]?.opponent]?.socket;
}

server.listen(4000, () => {
  console.log('listening on port 4000');
});
