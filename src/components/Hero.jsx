import "./Hero.css";
import heroImg from "../assets/hero.png";

function Hero() {
    return (
        <section className="hero-container">
            <div className="hero-left">
                <img src={heroImg} alt="Begum Donmez" className="hero-image" />
            </div>
            <div className="hero-right">
                <h1 className="hero-name">Begüm Dönmez</h1>
                <h2 className="hero-title">Game Developer</h2>
                <p className="hero-description">
                    Driven by curiosity, fueled by imagination.
                </p>
            </div>
        </section>
    );
}

export default Hero;