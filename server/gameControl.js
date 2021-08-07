const io = require('./server');
const players = {};
let rival;
const {
  makeMove,
  restart,
  matchPlayers,
  setPlayerForMatch,
} = require('./controllers');

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
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
  socket.on('make move', (data) => makeMove(data, getOpponent, socket));

  socket.on('restart', () => restart(socket, getOpponent));

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    const opponent = getOpponent(socket);
    if (opponent) {
      opponent.emit('waiting for opponent');
      if (rival) {
        matchPlayers(players, rival, opponent);
        rival = null;
      } else {
        setPlayerForMatch(players, opponent);
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
