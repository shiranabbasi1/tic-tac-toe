import React from "react";
import { createRoot } from 'react-dom/client';
import './index.css';


function Square (props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      history: [
        {
          squares: Array(9).fill(null),
          move: [-1, -1]
        }
      ],
      stepNumber: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history[history.length - 1].squares;
    var squares = current.slice();
    if (squares[i]
      || this.checkWinner(current)) {
        return;
      }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const sqrt = Math.sqrt(squares.length);
    const row = (sqrt * Math.ceil((i + 1)/sqrt)) / sqrt;
    let col = (i + 1) % (sqrt);
    col = (col === 0) ? 3 : col;
    this.setState({
      history: history.concat({
        squares: squares,
        move: [row, col]
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  checkWinner(squares) {
    var winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (var i = 0; i < winningCombinations.length; i++) {
      var [a, b, c] = winningCombinations[i].map(x => squares[x]);
      if (a
        && (a === b)
        && (a === c)) {
          return a;
        }
    }
    return null;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.checkWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? ("Go to move #" + move + " (" + step.move[0] + ", " + step.move[1] + ")") : "Go to game start";
      return (
        <li key={move} className={(this.state.stepNumber === move) ? "b-move" : ""}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            onClick={(i) => this.handleClick(i)}
            xIsNext={this.state.xIsNext}
            squares={this.state.history[this.state.stepNumber].squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  const root = createRoot(document.getElementById("root"));
  root.render(<Game />);
  