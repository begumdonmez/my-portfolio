function TarotCard({ title, subtitle, variant = "interactive" }) {
    const isStatic = variant === "back" || variant === "front";

    return (
        <div
            className={`tarot-card ${variant} ${
                isStatic ? "static-card" : ""
            }`}
        >
            <div className="tarot-inner">
                <div className="tarot-side tarot-back" />
                <div className="tarot-side tarot-front">
                    {title && <h2>{title}</h2>}
                    {subtitle && <span>{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}

export default TarotCard;
