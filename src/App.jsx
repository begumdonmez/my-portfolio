function TarotCard({ title, subtitle }) {
    return (
        <div className="tarot-card">
            <div className="tarot-face tarot-back" />
            <div className="tarot-face tarot-front">
                <h2>{title}</h2>
                <span>{subtitle}</span>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="tarot-container">
            <TarotCard title="The Seeker" subtitle="About" />
            <TarotCard title="The Works" subtitle="Projects" />
            <TarotCard title="The Call" subtitle="Contact" />
        </div>
    );
}
