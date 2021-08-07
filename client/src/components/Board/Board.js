import React, { useState, useEffect } from 'react';
import Square from '../Square/Square';
import './board.css';
import { calculateWinner } from '../../helper';
import { io } from 'socket.io-client';

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
    status = xIsNext ? 'Next Player: X' : 'Next Player: O';
  }

  const handleClick = (i) => {
    console.log('1');
    console.log(symbol, 'xisnext:', xIsNext);
    // test that it is your turn
    if ((xIsNext && symbol === 'O') || (!xIsNext && symbol === 'X')) return;
    console.log('2');
    const tempSquares = squares.slice();
    // case there is a winner or square is already taken
    if (calculateWinner(squares) || squares[i]) return;
    console.log('3');
    tempSquares[i] = symbol;
    setSquares(tempSquares);
    socket.emit('make move', { squares: tempSquares, xIsNext: !xIsNext });
    setXisNext(!xIsNext);
    console.log('4');
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const connect = () => {
    const socket = io('http://localhost:4000/');
    setSocket(socket);

    socket.on('move made', (data) => {
      console.log('move made');
      setSquares(data.squares);
      setXisNext(data.xIsNext);
    });

    socket.on('game begin', ({ symbol }) => {
      console.log('game begin', symbol);
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
    // socket.on('test', (msg) => {
    //   console.log(msg);
    // });
  };
  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      {waitForOpponent ? (
        <h1> Waiting for player to join</h1>
      ) : (
        <>
          <div>you are: {symbol}</div>
          <div className='status'>{status}</div>
          <div className='board-row'>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className='board-row'>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className='board-row'>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
          <button
            onClick={() => {
              socket.emit('restart');
            }}
          >
            Restart
          </button>
        </>
      )}
    </div>
  );
};

export default Board;
