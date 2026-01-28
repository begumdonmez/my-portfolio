import TarotCard from "./TarotCard";
import "./index.css";

function App() {
    return (
        <div className="app">
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
        </div>
    );
}

export default App;
