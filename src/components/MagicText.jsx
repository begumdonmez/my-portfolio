import "./MagicText.css";

function MagicText({ text }) {
    return (
        <h2 className="spell-text">
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </h2>
    );
}

export default MagicText;
