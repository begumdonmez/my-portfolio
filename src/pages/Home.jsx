import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-container">
            {/* 3D Arka Plan Katmanları */}
            <div className="background-3d">
                <div className="grid-floor"></div>
                <div className="horizon-glow"></div>
            </div>

            {/* Ana İçerik */}
            <div className="hero-section">
                <h1 className="glitch-text">BEGÜM</h1>
                <p className="subtitle">Digital Game Designer | Level 4</p>

                <div className="hero-buttons">
                    <Link to="/showcase" className="btn-primary">START GAME</Link>
                    <Link to="/aboutme" className="btn-secondary">LOAD INFO</Link>
                </div>
            </div>

            {/* Karakter Görseli */}
            <div className="image-wrapper">
                <img src="/begu.png" alt="Begüm Character" className="hero-image" />
            </div>
        </div>
    );
}

export default Home;