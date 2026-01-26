import React, { useState } from "react";
import "./Games.css";

function Games() {
    const [activeGame, setActiveGame] = useState(null);

    const games = [
        {
            id: "sultanahmet",
            title: "Sultanahmet: Historical Layers",
            shortDesc: "Explore the layered history of Sultanahmet.",
            longDesc:
                "Sultanahmet: Historical Layers is an interactive WebGL experience that allows players to walk through different historical periods of Istanbul. Discover reconstructed streets, hidden details, and interactive historical objects.",
            tags: ["#WebGL", "#Unity", "#History"],
            cover: "/games/sultanahmet_cover.png",
            buildUrl: "/webgl/sultanahmet/index.html",
        },
        {
            id: "santas_workers",
            title: "Santas Workers",
            shortDesc: "A festive holiday mini-game collection.",
            longDesc:
                "Santas Workers is a cheerful WebGL project where players help Santa’s helpers with toy production, reindeer management, and holiday-themed puzzles.",
            tags: ["#WebGL", "#Unity", "#GameJam"],
            cover: "/games/Santas_Workers_cover.png",
            buildUrl: "/webgl/santas_workers/index.html",
        },
        {
            id: "ballerino_online",
            title: "Ballerino Online",
            shortDesc: "Online rhythm-based dance battles.",
            longDesc:
                "Ballerino Online is a competitive WebGL rhythm game featuring online matches, customizable dancers, and smooth 16:9 gameplay.",
            tags: ["#WebGL", "#Unity", "#Online"],
            cover: "/games/ballerino_online_cover.png",
            buildUrl: "/webgl/ballerino_online/index.html",
        },
    ];

    return (
        <section className="games-section">
            <h2 className="section-title">Games</h2>

            <div className="games-grid">
                {games.map((game) => (
                    <React.Fragment key={game.id}>
                        {/* GAME CARD (STATIC CONTENT) */}
                        <div
                            className="game-card"
                            onClick={() =>
                                setActiveGame(activeGame === game.id ? null : game.id)
                            }
                        >
                            <img
                                src={game.cover}
                                alt={game.title}
                                className="game-cover"
                            />

                            <h3 className="game-title">{game.title}</h3>

                            <p className="game-desc">{game.shortDesc}</p>

                            {/* TAGS UNDER SHORT DESC */}
                            <div className="game-tags">
                                {game.tags.map((tag, i) => (
                                    <span key={i}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* EXPANDED PLAYABLE AREA */}
                        {activeGame === game.id && (
                            <div className="game-expand">
                                {/* LEFT: GAME */}
                                <div className="game-player">
                                    <div className="game-scale">
                                        <iframe
                                            src={game.buildUrl}
                                            title={game.title}
                                            width="1920"
                                            height="1080"
                                        />
                                    </div>
                                </div>

                                {/* RIGHT: LONG INFO */}
                                <div className="game-info">
                                    <h3 className="game-title">{game.title}</h3>

                                    <p>{game.longDesc}</p>

                                    {/* TAGS UNDER LONG DESC */}
                                    <div className="game-tags">
                                        {game.tags.map((tag, i) => (
                                            <span key={i}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}

export default Games;
