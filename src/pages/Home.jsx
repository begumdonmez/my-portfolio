import "./Home.css";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        // TV açılış efekti bitince overlay otomatik kaybolur
        const overlay = document.querySelector(".tv-overlay");
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add("tv-off");
            }, 1200);
        }
    }, []);

    return (
        <div className="home-root">
            {/* TV AÇILIŞ OVERLAY */}
            <div className="tv-overlay" />

            {/* 3D / PARTICLE ARKA PLAN */}
            <div className="bg-3d">
                <div className="particle p1" />
                <div className="particle p2" />
                <div className="particle p3" />
                <div className="particle p4" />
                <div className="particle p5" />
            </div>

            {/* HERO */}
            <section className="hero-section">
                <div className="image-wrapper">
                    <img
                        src="/begu.png"
                        alt="Hero"
                        className="hero-image"
                    />
                </div>

                <h1 className="hero-title">Begüm Dönmez</h1>
                <p className="hero-subtitle">
                    Game Designer · Level Designer · Creative Technologist
                </p>

                <div className="hero-buttons">
                    <button className="primary-btn">Load Info</button>
                    <button className="secondary-btn">View Projects</button>
                </div>
            </section>
        </div>
    );
}

export default Home;
