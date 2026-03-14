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
                <h2 className="hero-title">Digital Game Dev</h2>
                <p className="hero-description">
                    4th-year Digital Game Design student and a storyteller at heart. I love discovering and creating new worlds—whether through code or prose. Currently working as a Game Design Intern and managing Bumedya, while learning about AI and Cyber Security. Driven by curiosity, fueled by imagination.
                </p>
            </div>
        </section>
    );
}

export default Hero;