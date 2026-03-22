import React, { useState, Suspense, lazy } from "react";
import Background from "./components/Background";
import SocialSidebar from './components/SocialSidebar';
import Cards from "./components/Cards";
import Hero from "./components/Hero";
import "./App.css";
import About from "./components/About";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";

const Orderland = lazy(() => import("./components/Orderland"));

function App() {
    const [isOrderland, setIsOrderland] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    const startTransition = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsOrderland(true);
            setIsTransitioning(false);
        }, 3000);
    };

    const returnToReality = () => {
        setIsReturning(true);
        setTimeout(() => {
            setIsOrderland(false);
            setIsReturning(false);
        }, 3000);
    };

    return (
        <div className="app-container">
            <Background />

            {isTransitioning && <div className="rabbit-hole-overlay"></div>}
            {isReturning && <div className="return-reality-overlay"></div>}

            {!isOrderland ? (
                <>
                    <SocialSidebar />
                    <div className="content">
                        <Hero />
                        <Cards />
                        <About />
                        <Projects />
                        <Skills />
                        <Contact />
                    </div>

                    <div className="door-button" onClick={startTransition} style={{ zIndex: 1000 }}>
                        Follow the Rabbit? 🐇
                    </div>
                </>
            ) : (
                <Suspense fallback={<div className="loading-wonderland">Falling through the hole...</div>}>
                    <Orderland onBack={returnToReality} />
                </Suspense>
            )}
        </div>
    );
}

export default App;