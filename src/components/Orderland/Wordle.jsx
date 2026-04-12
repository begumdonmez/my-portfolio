import React, { useState, useEffect } from 'react';
import './Wordle.css';
import DICTIONARY from './words.json'; // 5000+ kelimelik TDK listesi
import TARGET_WORDS from './targets.json'; // Oyunun seçtiği popüler kelimeler

function Wordle() {
    // 5 dakikada bir sistem saatine göre kelimeyi belirle
    const getTargetWord = () => {
        const timeIndex = Math.floor(Date.now() / (5 * 60 * 1000));
        return TARGET_WORDS[timeIndex % TARGET_WORDS.length].toLocaleUpperCase('tr-TR');
    };

    const [targetWord, setTargetWord] = useState(getTargetWord());
    const [guesses, setGuesses] = useState(Array(6).fill(""));
    const [currentGuess, setCurrentGuess] = useState("");
    const [activeRow, setActiveRow] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [warning, setWarning] = useState("");

    // Sistem senkronizasyonu: 5 dakika dolunca oyunu sıfırla
    useEffect(() => {
        const interval = setInterval(() => {
            const nextWord = getTargetWord();
            if (nextWord !== targetWord) {
                setTargetWord(nextWord);
                setGuesses(Array(6).fill(""));
                setCurrentGuess("");
                setActiveRow(0);
                setIsGameOver(false);
                setWarning("SYSTEM REBOOT: NEW TARGET ACQUIRED");
                setTimeout(() => setWarning(""), 3000);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetWord]);

    // Harf durumunu kontrol eden algoritma
    const getCellClass = (guess, char, index) => {
        if (!guess) return "";
        if (char === targetWord[index]) return "correct"; // Yeşil
        if (targetWord.includes(char)) return "present"; // Sarı
        return "absent"; // Gri
    };

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (isGameOver) return;

            if (e.key === 'Enter') {
                if (currentGuess.length !== 5) return;

                // TDK Sözlük Doğrulaması
                const formattedGuess = currentGuess.toLocaleUpperCase('tr-TR');
                if (!DICTIONARY.includes(formattedGuess)) {
                    setWarning("INVALID PROTOCOL: WORD NOT IN DATABASE");
                    setTimeout(() => setWarning(""), 2000);
                    return;
                }

                const newGuesses = [...guesses];
                newGuesses[activeRow] = formattedGuess;
                setGuesses(newGuesses);

                if (formattedGuess === targetWord || activeRow === 5) {
                    setIsGameOver(true);
                } else {
                    setActiveRow(prev => prev + 1);
                    setCurrentGuess("");
                }
            }

            if (e.key === 'Backspace') {
                setCurrentGuess(prev => prev.slice(0, -1));
            }

            if (/^[A-Za-zçğışöüÇĞİŞÖÜ]$/.test(e.key) && currentGuess.length < 5) {
                setCurrentGuess(prev => (prev + e.key).toLocaleUpperCase('tr-TR'));
            }
        };

        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [currentGuess, guesses, isGameOver, activeRow, targetWord]);

    return (
        <div className="wordle-container">
            <div className="game-header">
                <span className="module-tag">MOD: 001 // TARGET_SYNC_ACTIVE</span>
                <h2 className="game-title">ORDER</h2>
            </div>

            <div className="wordle-grid">
                {guesses.map((guess, i) => {
                    const isCurrentRow = i === activeRow;
                    // Onaylanmış satırlar veya oyun bittiğinde dolu satırlar "past" sayılır
                    const isPastRow = i < activeRow || (isGameOver && guess !== "");
                    const displayWord = isCurrentRow ? currentGuess.padEnd(5, " ") : guess;

                    return (
                        <div key={i} className="wordle-row">
                            {displayWord.split("").map((char, j) => {
                                // Sadece geçmiş satırları renklendir ve flip animasyonuna sok
                                const statusClass = isPastRow ? getCellClass(guess, char, j) : "";

                                return (
                                    <div
                                        key={j}
                                        className={`wordle-cell ${statusClass} ${char !== " " && isCurrentRow ? "pop" : ""} ${isPastRow ? "flip" : ""}`}
                                        style={{
                                            // Her harf 150ms gecikmeyle dönsün
                                            animationDelay: isPastRow ? `${j * 150}ms` : '0ms'
                                        }}
                                    >
                                        {char}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Hata veya Sistem Mesajları */}
            {warning && <div className="system-warning">{warning}</div>}

            {isGameOver && (
                <div className="game-status-message">
                    <p className="system-text">
                        {guesses.includes(targetWord)
                            ? "ORDER RESTORED. ACCESS GRANTED."
                            : `ORDER LOST. TARGET WAS: ${targetWord}`}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Wordle;