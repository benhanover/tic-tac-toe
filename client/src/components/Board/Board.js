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
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = xIsNext ? 'Next Player: X' : 'Next Player: O';
  }

  const handleClick = (i) => {
    const tempSquares = squares.slice();
    // case there is a winner or square is already taken
    if (calculateWinner(squares) || squares[i]) return;
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
      setSymbol(symbol);
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
    </div>
  );
};

export default Board;
