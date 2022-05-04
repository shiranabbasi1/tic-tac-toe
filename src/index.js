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
        Array(9).fill(null)
      ]
    };
  }

  handleClick(i) {
    var current = this.state.history[this.state.history.length - 1];
    var squares = current.slice();
    if (squares[i]
      || this.checkWinner(current)) {
        return;
      }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.state.history.push(squares);
    this.setState({
      xIsNext: !this.state.xIsNext
    });
  }

  checkWinner(squares) {
    var winningCOmbinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (var i = 0; i < winningCOmbinations.length; i++) {
      var [a, b, c] = winningCOmbinations[i].map(x => squares[x]);
      if (a
        && (a === b)
        && (a === c)) {
          return a;
        }
    }
    return null;
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = this.checkWinner(current);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            onClick={(i) => this.handleClick(i)}
            xIsNext={this.state.xIsNext}
            squares={this.state.history[this.state.history.length - 1]}
          />
        </div>
        <div className="game-info">
        <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  const root = createRoot(document.getElementById("root"));
  root.render(<Game />);
  