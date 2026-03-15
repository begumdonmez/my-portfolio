import React from "react";
import Background from "./components/Background";
import SocialSidebar from './components/SocialSidebar';
import Cards from "./components/Cards";
import Hero from "./components/Hero"; // Yeni bileşeni import ediyoruz
import "./App.css";
import About from "./components/About";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx"; // CSS dosyanın import edildiğinden emin ol

function App() {
    return (
        <div className="app-container">
            <Background />
            <SocialSidebar />
            <div className="content">
                {/* Eski stil içeren HERO div'ini sildik, yerine bunu koyduk */}
                <Hero />

                {/* Navigasyon Kartları */}
                <Cards />

               <About />

               <Projects />

               <Skills/>

                <section id="contact" className="main-section">
                    <h2>Contact</h2>
                    <p>Benimle iletişime geçin.</p>
                </section>
            </div>
        </div>
    );
}

export default App;