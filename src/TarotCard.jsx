function TarotCard({
                       title,
                       subtitle,
                       frontImage,
                       backImage,
                       className = "",
                       force, // "open" | "closed"
                       onMouseEnter,
                       onMouseLeave,
                   }) {
    const forceClass =
        force === "open"
            ? "force-open"
            : force === "closed"
                ? "force-closed"
                : "";

    return (
        <div
            className={`tarot-card ${className} ${forceClass}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="tarot-inner">
                {/* BACK */}
                <div
                    className="tarot-side tarot-back"
                    style={{
                        backgroundImage: backImage
                            ? `url(${backImage})`
                            : undefined,
                    }}
                />

                {/* FRONT */}
                <div
                    className="tarot-side tarot-front"
                    style={{
                        backgroundImage: frontImage
                            ? `url(${frontImage})`
                            : undefined,
                    }}
                >
                    {title && <h2>{title}</h2>}
                    {subtitle && <span>{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}

export default TarotCard;
