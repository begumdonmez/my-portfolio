import React from "react";
import "./Games.css";

function Games() {
    return (
        <section className="games-section">
            <h2 className="section-title">Games</h2>

            <div className="games-grid">

                {/* GAME CARD */}
                <div className="game-card">
                    <img
                        src="/games/sultanahmet_cover.png"
                        alt="Sultanahmet Tarih Katmanları"
                        className="game-cover"
                    />

                    <h3 className="game-title">
                        Sultanahmet: Historical Layers
                    </h3>

                    <p className="game-desc">
                        An interactive WebGL project exploring the historical
                        layers of Sultanahmet through time.
                    </p>

                    <div className="game-tags">
                        <span>#WebGL</span>
                        <span>#Unity</span>
                        <span>#History</span>
                    </div>
                </div>

                <div className="game-card">
                    <img
                        src="/games/Santas_Workers_cover.png"
                        alt="Santas Workers"
                        className="game-cover"
                    />

                    <h3 className="game-title">
                        Santas Workers
                    </h3>

                    <p className="game-desc">
                        An interactive WebGL project exploring the historical
                        layers of Sultanahmet through time.
                    </p>

                    <div className="game-tags">
                        <span>#WebGL</span>
                        <span>#Unity</span>
                        <span>#GameJam</span>
                    </div>
                </div>

                <div className="game-card">
                    <img
                        src="/games/ballerino_online_cover.png"
                        alt="Ballerino Online"
                        className="game-cover"
                    />

                    <h3 className="game-title">
                        Ballerino Online
                    </h3>

                    <p className="game-desc">
                        An interactive WebGL project exploring the historical
                        layers of Sultanahmet through time.
                    </p>

                    <div className="game-tags">
                        <span>#WebGL</span>
                        <span>#Unity</span>
                        <span>#online</span>
                    </div>
                </div>

                <div className="game-card">
                    <img
                        src="/games/sultanahmet_cover.png"
                        alt="Sultanahmet Tarih Katmanları"
                        className="game-cover"
                    />

                    <h3 className="game-title">
                        Sultanahmet: Historical Layers
                    </h3>

                    <p className="game-desc">
                        An interactive WebGL project exploring the historical
                        layers of Sultanahmet through time.
                    </p>

                    <div className="game-tags">
                        <span>#WebGL</span>
                        <span>#Unity</span>
                        <span>#History</span>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Games;
