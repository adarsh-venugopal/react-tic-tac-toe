import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null }
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextMoveState) {
    const historyUpToNow = [
      ...history.slice(0, currentMove + 1),
      nextMoveState
    ];
    setHistory(historyUpToNow);
    setCurrentMove(historyUpToNow.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = `Go to move #${move} (${step.location.row}, ${step.location.col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <strong>{description}</strong>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    const location = { row: Math.floor(i / 3) + 1, col: (i % 3) + 1 };
    onPlay({ squares: nextSquares, location });
  }

  const winInfo = calculateWinner(squares);
  let status;
  if (winInfo) {
    const winner = winInfo.winner;
    status = 'Winner: ' + winner;
  } else if (squares.every((square) => square !== null)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  const rowCount = 3;
  const colCount = 3;

  for (let row = 0; row < rowCount; row++) {
    const rowSquares = [];
    for (let col = 0; col < colCount; col++) {
      const index = row * colCount + col;
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={winInfo && winInfo.line.includes(index)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={'square' + (highlight ? ' highlight' : '')}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}