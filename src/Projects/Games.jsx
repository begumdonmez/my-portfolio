import React, { useState, useEffect, useRef } from "react";
import "./Games.css";

function Games() {
    const [activeGame, setActiveGame] = useState(null);
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);

    const games = [
        {
            id: "sultanahmet",
            title: "Sultanahmet: Historical Layers",
            shortDesc: "Explore Sultanahmet in 3D!",
            longDesc: "Sultanahmet: Historical Layers is an interactive WebGL project where you can explore the historical layers of Sultanahmet through time. Walk through reconstructed streets, discover hidden details, and interact with historical objects. Perfect for history lovers and WebGL enthusiasts.",
            tags: ["#WebGL", "#Unity", "#History"],
            cover: "/games/sultanahmet_cover.png",
            buildUrl: "/webgl/sultanahmet/index.html",
        },
        {
            id: "santas_workers",
            title: "Santas Workers",
            shortDesc: "Holiday fun awaits!",
            longDesc: "Santas Workers is a festive WebGL project where you help Santa's helpers in various fun mini-games. Build toys, manage reindeer, and solve holiday puzzles. Great for a quick interactive holiday experience!",
            tags: ["#WebGL", "#Unity", "#GameJam"],
            cover: "/games/Santas_Workers_cover.png",
            buildUrl: "/webgl/santas_workers/index.html",
        },
        {
            id: "ballerino_online",
            title: "Ballerino Online",
            shortDesc: "Dance your way online!",
            longDesc: "Ballerino Online is a WebGL dance game where players compete online in rhythm challenges. Customize your dancer, join competitions, and enjoy smooth WebGL graphics in full 16:9 resolution.",
            tags: ["#WebGL", "#Unity", "#Online"],
            cover: "/games/ballerino_online_cover.png",
            buildUrl: "/webgl/ballerino_online/index.html",
        },
    ];

    // Scale hesaplama
    const updateScale = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const newScale = Math.min(1, containerWidth / 1920);
            setScale(newScale);
        }
    };

    useEffect(() => {
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <section className="games-section">
            <h2 className="section-title">Games</h2>

            <div className="games-grid" ref={containerRef}>
                {games.map((game) => (
                    <React.Fragment key={game.id}>
                        {/* Small card */}
                        <div
                            className="game-card"
                            onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
                        >
                            <img src={game.cover} alt={game.title} className="game-cover" />
                            <h3 className="game-title">{game.title}</h3>
                            <p className="game-desc">{activeGame === game.id ? game.longDesc : game.shortDesc}</p>
                            <div className="game-tags">
                                {game.tags.map((tag, i) => (
                                    <span key={i}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Expanded playable area */}
                        {activeGame === game.id && (
                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    width: "100%",
                                    margin: "20px auto 40px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    borderRadius: "20px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: "20px",
                                    padding: "10px",
                                }}
                            >
                                {/* Left: Playable WebGL */}
                                <div
                                    style={{
                                        width: `${1920 * scale}px`,
                                        height: `${1080 * scale}px`,
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                        borderRadius: "14px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <iframe
                                        src={game.buildUrl}
                                        title={game.title}
                                        width="1920"
                                        height="1080"
                                        style={{ border: "none", display: "block" }}
                                    ></iframe>
                                </div>

                                {/* Right: Long description */}
                                <div
                                    style={{
                                        flex: "1 1 35%",
                                        minWidth: "300px",
                                        maxWidth: "640px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        color: "var(--p-color)",
                                        fontSize: "16px",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    <h3 className="game-title">{game.title}</h3>
                                    <p>{game.longDesc}</p>
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
