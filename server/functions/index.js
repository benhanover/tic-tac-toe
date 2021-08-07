function initializePlayers(players, socket, rival) {
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
function getOpponent(players, socket) {
  if (!players[socket.id]?.opponent) return;
  return players[players[socket.id]?.opponent]?.socket;
}

module.exports = { initializePlayers, getOpponent };
