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
  console.log(Object.keys(players));

  if (getOpponent(socket)) {
    socket.emit('game begin', {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit('game begin', {
      symbol: players[getOpponent(socket).id].symbol,
    });
  } else {
    socket.emit('waiting for opponent');
  }

  socket.on('make move', (data) => {
    if (!getOpponent(socket)) return;
    console.log(socket.id);
    console.log(getOpponent(socket).id);
    socket.emit('move made', data);
    getOpponent(socket).emit('move made', data);
  });

  socket.on('restart', () => {
    socket.emit('restart');
    getOpponent(socket).emit('restart');
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    const opponent = getOpponent(socket);
    if (opponent) {
      opponent.emit('waiting for opponent');
      if (rival) {
        players[rival].symbol = 'X';
        players[opponent.id].symbol = 'O';
        players[rival].opponent = opponent.id;
        players[opponent.id].opponent = rival;
        players[rival].socket.emit('game begin', {
          symbol: players[rival].symbol,
        });
        opponent.emit('game begin', {
          symbol: players[opponent.id].symbol,
        });
        rival = null;
      } else {
        players[opponent.id].opponent = undefined;
        players[opponent.id].symbol = 'X';
        rival = opponent.id;
      }
    } else {
      rival = null;
    }
    delete players[socket.id];
    // console.log(Object.keys(players));
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
