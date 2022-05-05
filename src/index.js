import React from "react";
import { createRoot } from 'react-dom/client';
import Switch from '@mui/material/Switch';
import './index.css';


function Square (props) {
  return (
    <button
      className={`square ${props.win ? "win-box" : ""}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i, win) {
    return (
      <Square
        key={i}
        win={win}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  getSquares(winners) {
    var n = 3;
    var rowList = [];
    for (var i = 0; i <= (n * (n - 1)); i += 3) {
      var squares = [];
      for (var j = i; j < (i + n); j++) {
        squares.push(this.renderSquare(j, winners[j]));
      }
      var el = (<div key={i} className="board-row">{squares}</div>);
      rowList.push(el);
    }
    return rowList;
  }  

  render() {
    var winners = {};
    this.props.winners.forEach((x) => {
      winners[x] = true;
    });
    return (
      <div>
        {this.getSquares(winners)}
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
      stepNumber: 0,
      moveASC: true,
      totalSteps: 9
    };
  }

  moveOrderChange() {
    this.setState({
      moveASC: !this.state.moveASC
    });
  };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history[history.length - 1].squares;
    var squares = current.slice();
    var winners = this.checkWinner(current);
    if (squares[i]
      || (winners && winners.length)) {
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
      var [a, b, c] = winningCombinations[i];
      if (squares[a]
        && (squares[a] === squares[b])
        && (squares[a] === squares[c])) {
          return [a, b, c];
        }
    }
    return [];
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
    const winners = this.checkWinner(current.squares);
    let lost = false;
    let status;
    if (winners
      && winners.length) {
      status = 'Winner: ' + current.squares[winners[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      lost = (this.state.stepNumber === this.state.totalSteps)
    }

    const moves = history.map((step, move) => {
      const desc = move ? ("Go to move #" + move + " (" + step.move[0] + ", " + step.move[1] + ")") : "Go to game start";
      return (
        <li key={move} className={(this.state.stepNumber === move) ? "b-move" : ""}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (!this.state.moveASC) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
        <div className={lost ? "" : "hidden"}>
          <p className="bg-gold">Game drawn!</p>
        </div>
          <Board
            onClick={(i) => this.handleClick(i)}
            xIsNext={this.state.xIsNext}
            squares={this.state.history[this.state.stepNumber].squares}
            winners={winners}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Switch
            checked={this.state.moveASC}
            onChange={() => this.moveOrderChange()}
          />
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  const root = createRoot(document.getElementById("root"));
  root.render(<Game />);
  