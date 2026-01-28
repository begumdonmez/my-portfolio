import { useEffect, useState } from "react";
import TarotCard from "./TarotCard";
import "./index.css";

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
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="app">
            {/* HERO */}
            <section className="hero">
                <div className="tarot-container">
                    <TarotCard
                        title="The Seeker"
                        subtitle="Who I Am Beneath the Surface"
                    />
                    <TarotCard
                        title="The Works"
                        subtitle="What I Have Shaped"
                    />
                    <TarotCard
                        title="The Call"
                        subtitle="Reach Beyond Silence"
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
                    {/* SOL — KAPALI */}
                    <TarotCard variant="back" force="closed" />

                    {/* SAĞ — AÇIK */}
                    <TarotCard
                        variant="front"
                        force="open"
                        title="The Seeker"
                        subtitle="Game designer crafting systems, emotions and quiet moments."
                    />
                </div>
            </section>

        </div>
    );
}

export default App;
