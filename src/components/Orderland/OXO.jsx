import React, { useState } from 'react';
import './OXO.css';

function OXO() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const winnerInfo = calculateWinner(board);
    const winner = winnerInfo ? winnerInfo.winner : null;

    const handleClick = (i) => {
        if (winner || board[i]) return;
        const newBoard = board.slice();
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };

    const status = winner
        ? `PROTOCOL_TERMINATED: ${winner} ASCENDANT`
        : board.every(Boolean)
            ? "SYSTEM_STALEMATE"
            : `NEXT_SIGNAL: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="oxo-container">
            <div className="game-header">
                <span className="module-tag">MOD: 002 // GRID_COMBAT</span>
                <h2 className="game-title">OXO</h2>
            </div>

            <div className="oxo-grid">
                {board.map((cell, i) => (
                    <button
                        key={i}
                        className={`oxo-cell ${cell} ${winnerInfo?.line.includes(i) ? 'highlight' : ''}`}
                        onClick={() => handleClick(i)}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            <p className="system-text oxo-status">{status}</p>

            {(winner || board.every(Boolean)) && (
                <button className="back-button reset-btn" onClick={resetGame}>
                    REBOOT_PROTOCOL
                </button>
            )}
        </div>
    );
}

// Kazananı hesaplayan yardımcı fonksiyon
function calculateWinner(squares) {
    const lines = [
        ,,, // Yataylar
        ,,, // Dikeyler
        ,,             // Çaprazlar
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
}

export default OXO;