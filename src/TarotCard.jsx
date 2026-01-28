function TarotCard({ title, subtitle }) {
    return (
        <div className="tarot-card">
            <div className="tarot-inner">
                <div className="tarot-side tarot-back" />
                <div className="tarot-side tarot-front">
                    <h2>{title}</h2>
                    <span>{subtitle}</span>
                </div>
            </div>
        </div>
    );
}

export default TarotCard;
