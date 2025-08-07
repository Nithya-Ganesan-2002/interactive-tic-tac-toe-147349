import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Minimalistic and modern Tic Tac Toe game.
 * Features:
 * - Two-player local gameplay
 * - Centered board with score and reset control
 * - Game state display (whose turn, win, draw)
 * - Score tracking
 * - Clean light-themed styles (primary: #1976d2, accent: #ffeb3b, secondary: #757575)
 */

const COLORS = {
  primary: '#1976d2',
  accent: '#ffeb3b',
  secondary: '#757575',
};

const emptyBoard = () => Array(9).fill(null);

// Checks for winner; returns "X", "O", "draw", or null
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(cell => cell)) return 'draw';
  return null;
}

// SQUARE COMPONENT
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={highlight ? { background: COLORS.accent, color: COLORS.primary, fontWeight: 700 } : undefined}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// BOARD COMPONENT
// PUBLIC_INTERFACE
function Board({ squares, onClick, winningLine }) {
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => {
            const idx = 3 * row + col;
            const highlight = winningLine && winningLine.includes(idx);
            return (
              <Square
                key={idx}
                value={squares[idx]}
                highlight={highlight}
                onClick={() => onClick(idx)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// WINNING LINE DETECTOR
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

// TIC TAC TOE MAIN APP
// PUBLIC_INTERFACE
function App() {
  // State: game board, X/O, game state, score
  const [board, setBoard] = useState(emptyBoard());
  const [xIsNext, setXisNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningLine, setWinningLine] = useState(null);

  // On every board update, check for win/draw
  useEffect(() => {
    const result = calculateWinner(board);
    if (result && result !== 'draw') {
      setGameOver(true);
      setWinner(result);
      setScore(prev => ({ ...prev, [result]: prev[result] + 1 }));
      setWinningLine(getWinningLine(board));
    } else if (result === 'draw') {
      setGameOver(true);
      setWinner('draw');
      setWinningLine(null);
    } else {
      setGameOver(false);
      setWinner(null);
      setWinningLine(null);
    }
  }, [board]);

  // Handles board cell click
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || gameOver) return; // Ignore already filled or finished
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXisNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(emptyBoard());
    setXisNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  }

  // State display message
  let stateMessage;
  if (winner === 'draw') {
    stateMessage = "It's a draw! 🤝";
  } else if (winner) {
    stateMessage = `Player ${winner} wins! 🎉`;
  } else {
    stateMessage = `Player ${xIsNext ? 'X' : 'O'}'s turn`;
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-scoreboard" role="region" aria-label="Score">
          <div>
            <span className="ttt-score-label" style={{ color: COLORS.primary }}>X</span>
            <span className="ttt-score-number">{score.X}</span>
          </div>
          <div>
            <span className="ttt-score-label" style={{ color: COLORS.secondary }}>O</span>
            <span className="ttt-score-number">{score.O}</span>
          </div>
        </div>

        <div className="ttt-message">{stateMessage}</div>

        <Board squares={board} onClick={handleClick} winningLine={winningLine} />

        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleReset} aria-label="Reset game">
            Reset Game
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
