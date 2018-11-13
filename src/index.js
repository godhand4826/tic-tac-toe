import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(x, y) {
        return <Square
            value={this.props.squares[x][y]}
            onClick={() => this.props.onClick(x, y)}
            key={x + y * 3}

        />;
    }

    render() {

        let board = []
        for (let y = 0; y <= 2; y++) {
            let children = []
            for (let x = 0; x <= 2; x++) {
                children.push(this.renderSquare(x, y))
            }
            board.push(<div className="board-row" key={y}>{children}</div>)
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(3).fill(null).map(() => new Array(3).fill(null)),
                    dropX: null,
                    dropY: null
                }
            ],
            asc: true,
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(x, y) {
        console.log(x, y)
        const history = JSON.parse(JSON.stringify(this.state.history)).slice(0, this.state.stepNumber + 1)

        const current = history[history.length - 1]
        const squares = JSON.parse(JSON.stringify(current.squares))
        const { winner } = calculateWinner(squares)
        if (winner || squares[x][y]) {
            return
        }

        squares[x][y] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat(
                [{
                    squares: squares,
                    dropX: x,
                    dropY: y
                }]
            ),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    reorder() {
        this.setState({
            asc: !this.state.asc
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const { winner } = calculateWinner(current.squares)
        const status =
            this.state.stepNumber === 9 ? 'Draw' :
                (winner ? 'Winner: ' + winner :
                    'Next player: ' + (this.state.xIsNext ? 'X' : 'O'));


        const moves = history.map((h, move) => {
            const desc = move === 0 ?
                'Go to game start' :
                `Go to move #${move} (${h.dropX}, ${h.dropY})`;

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {this.state.stepNumber === move ? (<b>{desc}</b>) : desc}
                    </button>
                </li>
            )
        })

        if (!this.state.asc) {
            moves.reverse()
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(x, y) => this.handleClick(x, y)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.reorder()}>reorder moves</button>
                </div>
            </div>
        );
    }
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
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]

        if (squares[a % 3][a / 3 >> 0]
            && squares[a % 3][a / 3 >> 0] === squares[b % 3][b / 3 >> 0]
            && squares[b % 3][b / 3 >> 0] === squares[c % 3][c / 3 >> 0]) {
            return {
                winner: squares[a % 3][a / 3 >> 0],
                spots: [
                    { x: a % 3, y: a / 3 >> 0 },
                    { x: b % 3, y: b / 3 >> 0 },
                    { x: c % 3, y: c / 3 >> 0 }
                ]
            };
        }
    }
    return {};
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
