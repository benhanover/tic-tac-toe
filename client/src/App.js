import React, { useEffect, useState } from 'react';
import Board from './components/Board/Board';
// import { io } from 'socket.io-client';

function App() {
  // const connect = () => {
  //   const socket = io('http://localhost:4000/');
  //   // socket.on('test', (msg) => {
  //   //   console.log(msg);
  //   // });
  // };
  // useEffect(() => {
  //   connect();
  // }, []);

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <Board />
    </div>
  );
}

export default App;
