import { useEffect, useState } from "react";
import TarotCard from "./TarotCard";
import "./index.css";
import seekerFront from "./assets/tarots/seeker_front.png";
import seekerBack from "./assets/tarots/seeker_back.png";
import worksFront from "./assets/tarots/works_front.png";
import worksBack from "./assets/tarots/works_back.png";
import callFront from "./assets/tarots/call_front.png";
import callBack from "./assets/tarots/call_back.png";



function App() {
    const [aboutVisible, setAboutVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const trigger = window.innerHeight * 0.6;
            const section = document.getElementById("about");
            if (!section) return;

            const top = section.getBoundingClientRect().top;
            setAboutVisible(top < trigger);
        };

        window.addEventListener("scroll", onScroll);
        onScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* ===================== */}
            {/* FLOATING TAROT SYMBOLS */}
            {/* ===================== */}
            <div className="tarot-symbol-layer">
                {["☽", "✦", "✶", "☿", "♄", "♁", "♆"].map((symbol, i) => (
                    <span
                        key={i}
                        className="tarot-symbol"
                        style={{
                            left: `${8 + i * 12}%`,
                            animationDelay: `${i * 4}s`,
                            fontSize: `${16 + i * 4}px`
                        }}
                    >
                        {symbol}
                    </span>
                ))}
            </div>

            {/* ===================== */}
            {/* APP CONTENT */}
            {/* ===================== */}
            <div className="app">

                {/* HERO */}
                <section className="hero">
                    <div className="tarot-container">
                        <TarotCard
                            title="The Seeker"
                            subtitle="Who I Am Beneath the Surface"
                            frontImage={seekerFront}
                            backImage={seekerBack}
                        />

                        <TarotCard
                            title="The Works"
                            subtitle="What I Have Shaped"
                            frontImage={worksFront}
                            backImage={worksBack}
                        />

                        <TarotCard
                            title="The Call"
                            subtitle="Reach Beyond Silence"
                            frontImage={callFront}
                            backImage={callBack}
                        />

                    </div>
                </section>

                {/* ABOUT */}
                <section
                    id="about"
                    className={`about-section ${
                        aboutVisible ? "about-visible" : "about-hidden"
                    }`}
                >
                    <div className="about-cards">
                        <TarotCard
                            className="back static-card"
                            backImage={seekerBack}
                            force="closed"
                        />

                        {/* SAĞ — AÇIK (ön yüz görünüyor) */}
                        <TarotCard
                            className="front static-card"
                            frontImage={seekerFront}
                            title="The Maker"
                            subtitle="I design systems, emotions, and quiet moments."
                            force="open"
                        />

                    </div>
                </section>

            </div>
        </>
    );
}

export default App;
