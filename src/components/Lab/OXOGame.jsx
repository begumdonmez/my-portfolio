import React, { useState } from 'react';

const OxoGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    // Kazananı hesaplayan fonksiyon
    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Yatay
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dikey
            [0, 4, 8], [2, 4, 6]             // Çapraz
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(square => square !== null);

    const handleClick = (i) => {
        // Eğer oyun bittiyse veya hücre doluysa tıklamayı engelle
        if (winner || board[i]) return;

        const newBoard = [...board];
        newBoard[i] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                {winner ? `Kazanan: ${winner}` : isDraw ? "Berabere!" : `Sıra: ${isXNext ? 'X' : 'O'}`}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 80px)',
                gap: '5px',
                justifyContent: 'center'
            }}>
                {board.map((value, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        style={{
                            width: '80px',
                            height: '80px',
                            fontSize: '24px',
                            cursor: 'pointer',
                            background: '#222',
                            color: '#fff',
                            border: '1px solid #444',
                            borderRadius: '8px'
                        }}
                    >
                        {value}
                    </button>
                ))}
            </div>

            <button
                onClick={resetGame}
                style={{
                    marginTop: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    background: '#bb86fc',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#000',
                    fontWeight: 'bold'
                }}
            >
                Sıfırla
            </button>
        </div>
    );
};

export default OxoGame;