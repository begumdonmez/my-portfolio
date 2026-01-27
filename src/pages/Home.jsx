import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        
        <div className="home-container tv-on-effect">
            
            <div className="scanlines"></div>
            <div className="vignette"></div>

            <div className="background-3d">
                <div className="grid-floor"></div>
                <div className="horizon-glow"></div>

                <div className="magic-particles">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="particle"></div>
                    ))}
                </div>
            </div>

            <div className="hero-section">
                <h1 className="glitch-text">BEGÜM</h1>
                <p className="subtitle">Digital Game Designer | Level 4</p>

                <div className="hero-buttons">
                    <Link to="/showcase" className="btn-primary">START GAME</Link>
                    <Link to="/aboutme" className="btn-secondary">LOAD INFO</Link>
                </div>
            </div>

            <div className="image-wrapper">
                <img src="/begu.png" alt="Begüm Character" className="hero-image" />
            </div>
        </div>
    );
}

export default Home;