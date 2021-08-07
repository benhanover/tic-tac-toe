const io = require('./server');
// player: { opponent, symbol, socket }
const players = {};
// rival holds the socket id of an unmatched player
let rival;
// prettier-ignore
const { makeMove, restart, matchPlayers, setPlayerForMatch } = require('./controllers');

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');
  // set player in players, match it to another player if possible or put him next in line using rival
  setPlayer(socket);
  const opponentSocket = getOpponent(socket);
  // we have matched players => start the game
  if (opponentSocket) {
    socket.emit('game begin', {
      symbol: players[socket.id].symbol,
    });
    opponentSocket.emit('game begin', {
      symbol: players[opponentSocket.id].symbol,
    });
  } else {
    socket.emit('waiting for opponent');
  }
  socket.on('make move', (data) => makeMove(data, getOpponent, socket));

  socket.on('restart', () => restart(socket, getOpponent));

  socket.on('disconnect', () => disconnect(socket));
});

/////////////////////////////////////////////////////////////////////////////////////////////////
// first player goes to else, second player get inside the if
function setPlayer(socket) {
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
/////////////////////////////////////////////////////////////////////////////////////////////////
function getOpponent(socket) {
  if (!players[socket.id]?.opponent) return;
  return players[players[socket.id]?.opponent]?.socket;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function disconnect(socket) {
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
}
