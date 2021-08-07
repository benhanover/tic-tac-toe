const makeMove = (data, getOpponent, socket) => {
  if (!getOpponent(socket)) return;
  console.log(socket.id);
  console.log(getOpponent(socket).id);
  socket.emit('move made', data);
  getOpponent(socket).emit('move made', data);
};

const restart = (socket, getOpponent) => {
  socket.emit('restart');
  getOpponent(socket).emit('restart');
};

const matchPlayers = (players, rival, opponent) => {
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
};

const setPlayerForMatch = (players, opponent) => {
  players[opponent.id].opponent = undefined;
  players[opponent.id].symbol = 'X';
};

module.exports = { makeMove, restart, matchPlayers, setPlayerForMatch };
