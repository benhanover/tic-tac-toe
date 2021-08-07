import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Square from '../Square/Square';
import { calculateWinner } from '../../helper';
import './board.css';

const Board = () => {
  const [socket, setSocket] = useState();
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [symbol, setSymbol] = useState();
  const [xIsNext, setXisNext] = useState(true);
  const [waitForOpponent, setWaitForOpponent] = useState(true);

  let winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    const isDraw = squares.every((val) => val !== null);
    status = isDraw
      ? 'Draw'
      : (xIsNext && symbol === 'X') || (!xIsNext && symbol === 'O')
      ? 'Your Turn'
      : 'Opponent Turn';
  }

  const handleClick = (i) => {
    // test that it is your turn
    if ((xIsNext && symbol === 'O') || (!xIsNext && symbol === 'X')) return;
    // case there is a winner or square is already taken
    if (calculateWinner(squares) || squares[i]) return;

    const tempSquares = squares.slice();
    tempSquares[i] = symbol;
    setSquares(tempSquares);
    socket.emit('make move', { squares: tempSquares, xIsNext: !xIsNext });
    setXisNext(!xIsNext);
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const connect = () => {
    const socket = io('http://localhost:4000/');
    setSocket(socket);

    socket.on('move made', (data) => {
      setSquares(data.squares);
      setXisNext(data.xIsNext);
    });

    socket.on('game begin', ({ symbol }) => {
      winner = null;
      setWaitForOpponent(false);
      setXisNext(true);
      setSymbol(symbol);
    });

    socket.on('restart', () => {
      setSquares(Array(9).fill(null));
      winner = null;
    });

    socket.on('waiting for opponent', () => {
      setSquares(Array(9).fill(null));
      setWaitForOpponent(true);
    });
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      {waitForOpponent ? (
        <div className='waiting-for-div'>
          <h1> Waiting for player to join</h1>
        </div>
      ) : (
        <div className='board-container'>
          <div className='messages'>
            <div>you are: {symbol}</div>
            <div className='status'>{status}</div>
          </div>
          <div className='board'>
            <div>
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </div>
            <div>
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </div>
            <div>
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </div>
          </div>
          {(winner || status === 'Draw') && (
            <div className='restart-button-container'>
              <button
                className='restart-button'
                onClick={() => {
                  socket.emit('restart');
                }}
              >
                Restart
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Board;
