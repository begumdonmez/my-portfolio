import React, { useState, useEffect } from 'react';
import wordList from "../../data/words.json";

const Wordle = () => {
    // State Tanımlamaları
    const [solution, setSolution] = useState(() => {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex].toUpperCase('tr-TR');
    });
    const [guesses, setGuesses] = useState(Array(6).fill(""));
    const [currentGuess, setCurrentGuess] = useState("");
    const [turn, setTurn] = useState(0);
    const [status, setStatus] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);

    // Mesaj Gösterme Fonksiyonu
    const showStatus = (msg) => {
        setStatus(msg);
        if (!isGameOver) {
            setTimeout(() => setStatus(""), 2000);
        }
    };

    // Klavye Dinleyicisi
    useEffect(() => {
        const handleKeyUp = (e) => {
            if (isGameOver) return;

            if (e.key === 'Enter') {
                const guess = currentGuess.toUpperCase('tr-TR');

                if (guess.length !== 5) {
                    showStatus("5 harf girmelisin!");
                    return;
                }

                if (!wordList.includes(guess)) {
                    showStatus("Sözlükte bulunamadı!");
                    return;
                }

                const newGuesses = [...guesses];
                newGuesses[turn] = guess;
                setGuesses(newGuesses);

                if (guess === solution) {
                    setIsGameOver(true);
                    setStatus("TEBRİKLER! 🎉");
                } else if (turn === 5) {
                    setIsGameOver(true);
                    setStatus(`KAYBETTİN... Cevap: ${solution}`);
                } else {
                    setTurn(turn + 1);
                    setCurrentGuess("");
                }
            }

            if (e.key === 'Backspace') {
                setCurrentGuess(prev => prev.slice(0, -1));
                return;
            }

            // Sadece harf girişine izin ver (Türkçe karakterler dahil)
            if (/^[A-Za-zğüşıöçĞÜŞİÖÇ]$/.test(e.key) && currentGuess.length < 5) {
                setCurrentGuess(prev => prev + e.key.toUpperCase('tr-TR'));
            }
        };

        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [currentGuess, isGameOver, turn, guesses, solution]);

    // Kutu Renklendirme Mantığı
    const getBoxStyle = (letter, index, rowIndex) => {
        if (rowIndex >= turn) return { border: '2px solid #3a3a3c' };

        if (solution[index] === letter) return { background: '#538d4e', border: 'none' };
        if (solution.includes(letter)) return { background: '#b59f3b', border: 'none' };
        return { background: '#3a3a3c', border: 'none' };
    };

    return (
        <div className="wordle-wrapper">
            <div className={`wordle-status ${status ? 'visible' : ''}`}>
                {status}
            </div>

            <div className="wordle-grid">
                {guesses.map((guess, i) => {
                    const isCurrent = i === turn;
                    const displayGuess = isCurrent ? currentGuess.padEnd(5, " ") : guess.padEnd(5, " ");

                    return (
                        <div key={i} className="wordle-row">
                            {displayGuess.split("").map((letter, j) => (
                                <div
                                    key={j}
                                    className="wordle-cell"
                                    style={getBoxStyle(letter, j, i)}
                                >
                                    {letter !== " " ? letter : ""}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {isGameOver && (
                <button className="wordle-reset" onClick={() => window.location.reload()}>
                    YENİDEN OYNA
                </button>
            )}
        </div>
    );
};

export default Wordle;