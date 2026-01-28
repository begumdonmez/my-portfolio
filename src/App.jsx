import TarotCard from "./TarotCard";
import AboutSection from "./AboutSection";
import "./index.css";

function App() {
    return (
        <div className="app" style={{ flexDirection: "column" }}>
            {/* ÜST TAROT NAV */}
            <div className="tarot-container" style={{ minHeight: "100vh" }}>
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

            {/* ABOUT / BEN */}
            <AboutSection />
        </div>
    );
}

export default App;
