import React, { useState, useEffect, useCallback } from 'react';
import './Sudoku.css';

const PUZZLES = [
    {
        puzzle: [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9],
        ],
        solution: [
            [5,3,4,6,7,8,9,1,2],
            [6,7,2,1,9,5,3,4,8],
            [1,9,8,3,4,2,5,6,7],
            [8,5,9,7,6,1,4,2,3],
            [4,2,6,8,5,3,7,9,1],
            [7,1,3,9,2,4,8,5,6],
            [9,6,1,5,3,7,2,8,4],
            [2,8,7,4,1,9,6,3,5],
            [3,4,5,2,8,6,1,7,9],
        ]
    },
    {
        puzzle: [
            [0,2,0,6,0,8,0,0,0],
            [5,8,0,0,0,9,7,0,0],
            [0,0,0,0,4,0,0,0,0],
            [3,7,0,0,0,0,5,0,0],
            [6,0,0,0,0,0,0,0,4],
            [0,0,8,0,0,0,0,1,3],
            [0,0,0,0,2,0,0,0,0],
            [0,0,9,8,0,0,0,3,6],
            [0,0,0,3,0,6,0,9,0],
        ],
        solution: [
            [1,2,3,6,7,8,9,4,5],
            [5,8,4,2,3,9,7,6,1],
            [9,6,7,1,4,5,3,2,8],
            [3,7,2,4,6,1,5,8,9],
            [6,9,1,5,8,3,2,7,4],
            [4,5,8,7,9,2,6,1,3],
            [8,3,6,9,2,4,1,5,7],
            [2,1,9,8,5,7,4,3,6],
            [7,4,5,3,1,6,8,9,2],
        ]
    },
    {
        puzzle: [
            [0,0,0,2,6,0,7,0,1],
            [6,8,0,0,7,0,0,9,0],
            [1,9,0,0,0,4,5,0,0],
            [8,2,0,1,0,0,0,4,0],
            [0,0,4,6,0,2,9,0,0],
            [0,5,0,0,0,3,0,2,8],
            [0,0,9,3,0,0,0,7,4],
            [0,4,0,0,5,0,0,3,6],
            [7,0,3,0,1,8,0,0,0],
        ],
        solution: [
            [4,3,5,2,6,9,7,8,1],
            [6,8,2,5,7,1,4,9,3],
            [1,9,7,8,3,4,5,6,2],
            [8,2,6,1,9,5,3,4,7],
            [3,7,4,6,8,2,9,1,5],
            [9,5,1,7,4,3,6,2,8],
            [5,1,9,3,2,6,8,7,4],
            [2,4,8,9,5,7,1,3,6],
            [7,6,3,4,1,8,2,5,9],
        ]
    },
    {
        puzzle: [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,3,0,8,5],
            [0,0,1,0,2,0,0,0,0],
            [0,0,0,5,0,7,0,0,0],
            [0,0,4,0,0,0,1,0,0],
            [0,9,0,0,0,0,0,0,0],
            [5,0,0,0,0,0,0,7,3],
            [0,0,2,0,1,0,0,0,0],
            [0,0,0,0,4,0,0,0,9],
        ],
        solution: [
            [9,8,7,6,5,4,3,2,1],
            [2,4,6,1,7,3,9,8,5],
            [3,5,1,9,2,8,7,4,6],
            [1,2,8,5,3,7,6,9,4],
            [6,3,4,8,9,2,1,5,7],
            [7,9,5,4,6,1,8,3,2],
            [5,1,9,2,8,6,4,7,3],
            [4,7,2,3,1,9,5,6,8],
            [8,6,3,7,4,5,2,1,9],
        ]
    },
    {
        puzzle: [
            [0,0,5,3,0,0,0,0,0],
            [8,0,0,0,0,0,0,2,0],
            [0,7,0,0,1,0,5,0,0],
            [4,0,0,0,0,5,3,0,0],
            [0,1,0,0,7,0,0,0,6],
            [0,0,3,2,0,0,0,8,0],
            [0,6,0,5,0,0,0,0,9],
            [0,0,4,0,0,0,0,3,0],
            [0,0,0,0,0,9,7,0,0],
        ],
        solution: [
            [1,4,5,3,2,7,6,9,8],
            [8,3,9,6,5,4,1,2,7],
            [6,7,2,9,1,8,5,4,3],
            [4,9,6,1,8,5,3,7,2],
            [2,1,8,4,7,3,9,5,6],
            [7,5,3,2,9,6,4,8,1],
            [3,6,7,5,4,2,8,1,9],
            [9,8,4,7,6,1,2,3,5],
            [5,2,1,8,3,9,7,6,4],
        ]
    },
];

function Sudoku() {
    const [puzzleIndex] = useState(() => Math.floor(Math.random() * PUZZLES.length));
    const { puzzle, solution } = PUZZLES[puzzleIndex];

    const [board, setBoard] = useState(() => puzzle.map(row => [...row]));
    const [fixed] = useState(() => puzzle.map(row => row.map(cell => cell !== 0)));
    const [selected, setSelected] = useState(null);
    const [errors, setErrors] = useState(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(true);

    useEffect(() => {
        if (!timerActive || isComplete) return;
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, [timerActive, isComplete]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const checkCompletion = useCallback((b) => {
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
                if (b[r][c] !== solution[r][c]) return false;
        return true;
    }, [solution]);

    const checkErrors = useCallback((b) => {
        const errs = new Set();
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
                if (b[r][c] !== 0 && !fixed[r][c] && b[r][c] !== solution[r][c])
                    errs.add(`${r}-${c}`);
        return errs;
    }, [solution, fixed]);

    const inputNumber = useCallback((num) => {
        if (!selected || isComplete) return;
        const { row, col } = selected;
        if (fixed[row][col]) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = num;

        const newErrors = checkErrors(newBoard);
        setBoard(newBoard);
        setErrors(newErrors);

        if (checkCompletion(newBoard)) {
            setIsComplete(true);
            setTimerActive(false);
        }
    }, [selected, isComplete, fixed, board, checkErrors, checkCompletion]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selected || isComplete) return;
            if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                inputNumber(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
                inputNumber(0);
            } else if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(s => s.row > 0 ? { row: s.row - 1, col: s.col } : s); }
            else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => s.row < 8 ? { row: s.row + 1, col: s.col } : s); }
            else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelected(s => s.col > 0 ? { row: s.row, col: s.col - 1 } : s); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setSelected(s => s.col < 8 ? { row: s.row, col: s.col + 1 } : s); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selected, isComplete, inputNumber]);

    const isHighlighted = (r, c) => {
        if (!selected) return false;
        const sameRow = r === selected.row;
        const sameCol = c === selected.col;
        const sameBox = Math.floor(r / 3) === Math.floor(selected.row / 3) &&
                        Math.floor(c / 3) === Math.floor(selected.col / 3);
        return sameRow || sameCol || sameBox;
    };

    const getCellClass = (r, c) => {
        const classes = ['sudoku-cell'];
        if (fixed[r][c]) classes.push('fixed');
        if (selected) {
            if (selected.row === r && selected.col === c) {
                classes.push('selected');
            } else if (isHighlighted(r, c)) {
                classes.push('highlighted');
            }
            const selVal = board[selected.row][selected.col];
            if (selVal !== 0 && board[r][c] === selVal && !(selected.row === r && selected.col === c)) {
                classes.push('same-number');
            }
        }
        if (errors.has(`${r}-${c}`)) classes.push('error');
        return classes.join(' ');
    };

    const resetGame = () => {
        setBoard(puzzle.map(row => [...row]));
        setErrors(new Set());
        setIsComplete(false);
        setSelected(null);
        setTimer(0);
        setTimerActive(true);
    };

    return (
        <div className="sudoku-container">
            <div className="game-header">
                <span className="module-tag">MOD: 003 // LOGIC_GRID_PROTOCOL</span>
                <h2 className="game-title">SUDO</h2>
            </div>

            <div className="sudoku-info-row">
                <span className="sudoku-timer">{formatTime(timer)}</span>
                {errors.size > 0 && (
                    <span className="error-count">
                        ⚠ {errors.size} ANOMAL{errors.size === 1 ? 'Y' : 'IES'}
                    </span>
                )}
            </div>

            <div className="sudoku-board">
                {board.map((row, r) => (
                    <div key={r} className={`sudoku-row${r === 2 || r === 5 ? ' box-border-bottom' : ''}`}>
                        {row.map((cell, c) => (
                            <div
                                key={c}
                                className={`${getCellClass(r, c)}${c === 2 || c === 5 ? ' box-border-right' : ''}`}
                                onClick={() => setSelected({ row: r, col: c })}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="sudoku-numpad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <button key={n} className="numpad-btn" onClick={() => inputNumber(n)}>
                        {n}
                    </button>
                ))}
                <button className="numpad-btn erase-btn" onClick={() => inputNumber(0)}>⌫</button>
            </div>

            <button className="reset-btn" onClick={resetGame}>RESET_GRID</button>

            {isComplete && (
                <div className="game-status-message">
                    <p className="system-text">
                        GRID SOLVED. ACCESS GRANTED. TIME: {formatTime(timer)}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Sudoku;
