import React, { useState, useEffect, useCallback } from 'react';
import './Sudoku.css';

// ──── Sudoku Generator ──────────────────────────────────────

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    const sr = Math.floor(row / 3) * 3;
    const sc = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[sr + i][sc + j] === num) return false;
    return true;
}

function fillBoard(board, pos = 0) {
    if (pos === 81) return true;
    const r = Math.floor(pos / 9);
    const c = pos % 9;
    for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (isValid(board, r, c, n)) {
            board[r][c] = n;
            if (fillBoard(board, pos + 1)) return true;
            board[r][c] = 0;
        }
    }
    return false;
}

// MRV (minimum remaining values) heuristic — makes solver fast
function countSolutions(board) {
    let count = 0;
    const b = board.map(r => [...r]);

    function solve() {
        if (count > 1) return;
        let best = null;
        let minOpts = 10;
        outer: for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (b[r][c] !== 0) continue;
                let opts = 0;
                for (let n = 1; n <= 9; n++) if (isValid(b, r, c, n)) opts++;
                if (opts === 0) return; // dead end
                if (opts < minOpts) { minOpts = opts; best = [r, c]; }
                if (opts === 1) break outer;
            }
        }
        if (!best) { count++; return; }
        const [r, c] = best;
        for (let n = 1; n <= 9; n++) {
            if (isValid(b, r, c, n)) {
                b[r][c] = n;
                solve();
                b[r][c] = 0;
            }
        }
    }

    solve();
    return count;
}

const REMOVE_TARGETS = { EASY: 36, MEDIUM: 46, HARD: 53 };

function generatePuzzle(difficulty) {
    const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(solution);
    const puzzle = solution.map(r => [...r]);
    const cells = shuffle([...Array(81)].map((_, i) => [Math.floor(i / 9), i % 9]));

    let removed = 0;
    for (const [r, c] of cells) {
        if (removed >= REMOVE_TARGETS[difficulty]) break;
        const val = puzzle[r][c];
        puzzle[r][c] = 0;
        if (countSolutions(puzzle) === 1) {
            removed++;
        } else {
            puzzle[r][c] = val; // restore if not unique
        }
    }

    return { puzzle, solution };
}

// ──── Component ─────────────────────────────────────────────

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

function Sudoku() {
    const [difficulty, setDifficulty] = useState('MEDIUM');
    const [game, setGame]             = useState(() => generatePuzzle('MEDIUM'));
    const [board, setBoard]           = useState(() => game.puzzle.map(r => [...r]));
    const [fixed, setFixed]           = useState(() => game.puzzle.map(r => r.map(v => v !== 0)));
    const [selected, setSelected]     = useState(null);
    const [errors, setErrors]         = useState(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [timer, setTimer]           = useState(0);
    const [timerActive, setTimerActive] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Timer
    useEffect(() => {
        if (!timerActive || isComplete || generating) return;
        const id = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [timerActive, isComplete, generating]);

    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const checkCompletion = useCallback((b) => {
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
                if (b[r][c] !== game.solution[r][c]) return false;
        return true;
    }, [game.solution]);

    const checkErrors = useCallback((b) => {
        const errs = new Set();
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
                if (b[r][c] !== 0 && !fixed[r][c] && b[r][c] !== game.solution[r][c])
                    errs.add(`${r}-${c}`);
        return errs;
    }, [game.solution, fixed]);

    const inputNumber = useCallback((num) => {
        if (!selected || isComplete) return;
        const { row, col } = selected;
        if (fixed[row][col]) return;
        const nb = board.map(r => [...r]);
        nb[row][col] = num;
        const ne = checkErrors(nb);
        setBoard(nb);
        setErrors(ne);
        if (checkCompletion(nb)) { setIsComplete(true); setTimerActive(false); }
    }, [selected, isComplete, fixed, board, checkErrors, checkCompletion]);

    // Keyboard
    useEffect(() => {
        const onKey = (e) => {
            if (generating || isComplete || !selected) return;
            if (e.key >= '1' && e.key <= '9') { e.preventDefault(); inputNumber(+e.key); }
            else if (e.key === 'Backspace' || e.key === 'Delete') inputNumber(0);
            else if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(s => s.row > 0 ? { ...s, row: s.row - 1 } : s); }
            else if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => s.row < 8 ? { ...s, row: s.row + 1 } : s); }
            else if (e.key === 'ArrowLeft')  { e.preventDefault(); setSelected(s => s.col > 0 ? { ...s, col: s.col - 1 } : s); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); setSelected(s => s.col < 8 ? { ...s, col: s.col + 1 } : s); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [generating, selected, isComplete, inputNumber]);

    const isHighlighted = (r, c) => {
        if (!selected) return false;
        return r === selected.row || c === selected.col ||
            (Math.floor(r / 3) === Math.floor(selected.row / 3) &&
             Math.floor(c / 3) === Math.floor(selected.col / 3));
    };

    const getCellClass = (r, c) => {
        const cls = ['sudoku-cell'];
        if (fixed[r][c]) cls.push('fixed');
        if (selected) {
            if (selected.row === r && selected.col === c) cls.push('selected');
            else if (isHighlighted(r, c)) cls.push('highlighted');
            const sv = board[selected.row][selected.col];
            if (sv !== 0 && board[r][c] === sv && !(selected.row === r && selected.col === c))
                cls.push('same-number');
        }
        if (errors.has(`${r}-${c}`)) cls.push('error');
        return cls.join(' ');
    };

    // Count how many of each digit are on the board
    const digitCounts = Array(10).fill(0);
    for (const row of board) for (const cell of row) if (cell > 0) digitCounts[cell]++;

    const startGame = (diff) => {
        setGenerating(true);
        setDifficulty(diff);
        // Let React render the loading state first
        setTimeout(() => {
            const g = generatePuzzle(diff);
            setGame(g);
            setBoard(g.puzzle.map(r => [...r]));
            setFixed(g.puzzle.map(r => r.map(v => v !== 0)));
            setSelected(null);
            setErrors(new Set());
            setIsComplete(false);
            setTimer(0);
            setTimerActive(true);
            setGenerating(false);
        }, 30);
    };

    const resetGame = () => {
        setBoard(game.puzzle.map(r => [...r]));
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

            {/* Zorluk seçici */}
            <div className="sudoku-difficulty">
                {DIFFICULTIES.map(d => (
                    <button
                        key={d}
                        className={`diff-btn diff-${d.toLowerCase()}${difficulty === d ? ' diff-active' : ''}`}
                        onClick={() => startGame(d)}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {generating ? (
                <div className="sudoku-generating">
                    <span className="gen-dots">GENERATING_GRID</span>
                </div>
            ) : (
                <>
                    <div className="sudoku-info-row">
                        <span className="sudoku-timer">{fmt(timer)}</span>
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

                    {/* Numpad — tükenmiş sayılar solar */}
                    <div className="sudoku-numpad">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <button
                                key={n}
                                className={`numpad-btn${digitCounts[n] >= 9 ? ' exhausted' : ''}`}
                                onClick={() => inputNumber(n)}
                                disabled={digitCounts[n] >= 9}
                            >
                                {n}
                            </button>
                        ))}
                        <button className="numpad-btn erase-btn" onClick={() => inputNumber(0)}>⌫</button>
                    </div>

                    <button className="reset-btn" onClick={resetGame}>RESET_GRID</button>

                    {isComplete && (
                        <div className="game-status-message">
                            <p className="system-text">
                                GRID SOLVED. ACCESS GRANTED. TIME: {fmt(timer)}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Sudoku;
