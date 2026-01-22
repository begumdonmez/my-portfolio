import { useState, useEffect } from "react";
import "./MagicText.css";

function MagicText({ text }) {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        
        const interval = setInterval(() => {
            setAnimationKey((prev) => prev + 1);
        }, 10000);

        return () => clearInterval(interval); // Bileşen kapandığında hafızayı temizler
    }, []);

    return (
        /* key her değiştiğinde React bu başlığı ve içindeki tüm harfleri 
           yeniden oluşturur, böylece CSS animasyonu tetiklenir. */
        <h2 className="spell-text" key={animationKey}>
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