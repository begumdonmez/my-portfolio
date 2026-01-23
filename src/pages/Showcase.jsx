import "./Showcase.css";

function Showcase() {
    return (
        <div className="showcase">
            <h1>Showcase</h1>

            <section className="showcase-section">
                <h2>2D World</h2>
                <div className="project-list">
                    <div className="project-card">
                        <img src="/projects/2d_1.png" alt="2D Project" />
                        <h3>Lost Timeline</h3>
                        <p>2D puzzle game with time-based mechanics.</p>
                    </div>
                </div>
            </section>

            <section className="showcase-section">
                <h2>3D World</h2>
                <div className="project-list">
                    <div className="project-card">
                        <iframe
                            src="/webgl/3d_project/index.html"
                            title="3D Project"
                        />
                        <h3>Echo Valley</h3>
                        <p>Explorable 3D environment built in Unity.</p>
                    </div>
                </div>
            </section>

            <section className="showcase-section">
                <h2>Game Projects</h2>
                <div className="project-list">
                    <div className="project-card">
                        <iframe
                            src="/webgl/game1/index.html"
                            title="WebGL Game"
                        />
                        <h3>Chrono Match</h3>
                        <p>Match-3 game with time travel theme.</p>
                    </div>
                </div>
            </section>

            <section className="showcase-section">
                <h2>Draws</h2>
                <div className="project-list">
                    <div className="project-card">
                        <img src="/draws/draw1.png" alt="Drawing" />
                        <h3>Character Concept</h3>
                        <p>Digital illustration for game characters.</p>
                    </div>
                </div>
            </section>

            <section className="showcase-section">
                <h2>Scenarios</h2>
                <div className="project-list">
                    <div className="project-card text-only">
                        <h3>The Last Loop</h3>
                        <p>
                            Narrative-driven sci-fi story about repeating timelines
                            and memory loss.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Showcase;
