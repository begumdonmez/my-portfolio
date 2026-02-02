import { useEffect, useState } from "react";
import TarotCard from "./TarotCard";
import "./index.css";
import seekerFront from "./assets/tarots/seeker_front.png";
import seekerBack from "./assets/tarots/seeker_back.png";
import worksFront from "./assets/tarots/works_front.png";
import worksBack from "./assets/tarots/works_back.png";
import callFront from "./assets/tarots/call_front.png";
import callBack from "./assets/tarots/call_back.png";
import back from "./assets/tarots/try.png";
import makerBack from "./assets/tarots/maker_front.png";



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
                    <h1 className="hero-title">Choose Your Destiny</h1>
                    <div className="tarot-container">
                        <TarotCard
                            title=""
                            subtitle=""
                            frontImage={seekerFront}
                            backImage={back}
                        />

                        <TarotCard
                            title=""
                            subtitle=""
                            frontImage={worksFront}
                            backImage={back}
                        />

                        <TarotCard
                            title=""
                            subtitle=""
                            frontImage={callFront}
                            backImage={back}
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
                            backImage={back}
                            force="closed"
                        />

                        {/* SAĞ — AÇIK (ön yüz görünüyor) */}
                        <TarotCard
                            className="front static-card"
                            frontImage={makerBack}
                            title=""
                            subtitle=""
                            force="open"
                        />

                    </div>
                </section>

            </div>
        </>
    );
}

export default App;
