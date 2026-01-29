function TarotCard({ title, subtitle, variant, force }) {
    const classes = [
        "tarot-card",
        variant === "back" ? "back static-card" : "",
        variant === "front" ? "front static-card" : "",
        force === "open" ? "force-open" : "",
        force === "closed" ? "force-closed" : ""
    ].join(" ");

    return (
        <div className={classes}>
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
