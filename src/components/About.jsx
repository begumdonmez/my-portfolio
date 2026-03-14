import React from 'react';
import './About.css';
import aboutImg from '../assets/AboutMe.png';

function About() {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-image-side">
                    <img src={aboutImg} alt="Astronaut Exploration" className="about-pixel-art" />
                </div>

                <div className="about-text-side">
                    <h2>About Me</h2>
                    <p>
                        I am a Digital Game Design student at <strong>Beykoz University</strong> [cite: 10], where my academic journey has been honored with multiple <strong>Rector’s and Dean’s Certificates</strong> for high achievement. My passion for creation goes beyond code; it started with a lifelong love for <strong>writing</strong> and storytelling[cite: 83, 85].
                    </p>
                    <p>
                        In the industry, I’ve gained experience as a <strong>Level Designer</strong> [cite: 39, 41] and as a <strong>Developer</strong> on various projects ranging from multiplayer football games to awareness-driven bullet hells[cite: 49, 51, 61]. As the <strong>Founder & President of the Bumedya Media Club</strong> , I lead a creative community where we produce fanzines, podcasts, and digital content[cite: 69, 70].
                    </p>
                    <p>
                        My curiosity also leads me into the depths of <strong>criminal psychology</strong> and <strong>security</strong>[cite: 87], which fuels my interest in building more complex and immersive narratives. Whether I am working with Unity, Unreal Engine, or a simple pen and paper, I am dedicated to crafting worlds that leave an impact.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;