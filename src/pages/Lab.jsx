import React from 'react';
import OxoGame from "../components/Lab/OxoGame";
import Wordle from "../components/Lab/Wordle";
import "./Lab.css";

const Lab = () => {
    return (
        <div className="lab-page">
            <header className="lab-intro">
                <h1>🧪 Lab</h1>
                <p className="lab-subtitle">
                    Deneysel projeler, mini oyunlar ve kodlama pratikleri.
                </p>
            </header>

            <div className="lab-content">

                {/* 1. BÖLÜM: OXO (Yazı Solda, Oyun Sağda) */}
                <section className="lab-section reverse">
                    <div className="lab-text">
                        <div className="badge">DENEY #01</div>
                        <h2>OXO Game</h2>
                        <p>
                            Klasik Tic-Tac-Toe mantığının React state yönetimi ile hayat bulmuş hali.
                            Hücrelerin durumunu takip eden bir dizi ve kazananı belirleyen
                            kombinasyon algoritması üzerine kurulu bir çalışma.
                        </p>
                        <div className="tech-stack">
                            <span>#React</span>
                            <span>#Hooks</span>
                            <span>#CSS_Grid</span>
                        </div>
                    </div>
                    <div className="lab-game">
                        <div className="game-wrapper">
                            <OxoGame />
                        </div>
                    </div>
                </section>

                <hr className="lab-divider" />

                {/* 2. BÖLÜM: WORDLE (Oyun Solda, Yazı Sağda) */}
                <section className="lab-section">
                    <div className="lab-game">
                        <div className="game-wrapper">
                            <Wordle />
                        </div>
                    </div>
                    <div className="lab-text">
                        <div className="badge">DENEY #02</div>
                        <h2>Wordle Clone</h2>
                        <p>
                            Klavye etkinliklerini (event listeners) dinleyen ve kelime
                            doğrulama mantığıyla çalışan bir tahmin oyunu.
                            Harf yerleşimi ve renk kodlaması algoritmalarına odaklanıyor.
                        </p>
                        <div className="tech-stack">
                            <span>#DOM_Events</span>
                            <span>#Algorithms</span>
                            <span>#Logic</span>
                        </div>
                    </div>
                </section>

                {/* GELECEKTEKİ OYUNLAR İÇİN TASLAK (Opsiyonel) */}
                <section className="lab-section locked-section">
                    <p>Yeni deneyler yolda... 🥠</p>
                </section>

            </div>
        </div>
    );
};

export default Lab;