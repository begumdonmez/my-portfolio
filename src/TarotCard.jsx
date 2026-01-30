function TarotCard({
                       title,
                       subtitle,
                       variant = "interactive",
                       force = null,
                   }) {
    const isStatic = variant === "back" || variant === "front";

    return (
        <div
            className={`tarot-card ${variant} ${
                isStatic ? "static-card" : ""
            } ${force === "open" ? "force-open" : ""} ${
                force === "closed" ? "force-closed" : ""
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
