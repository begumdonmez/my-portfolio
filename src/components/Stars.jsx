import { useEffect, useRef, useState } from "react";
import "./stars.css";

export default function Stars({ count = 100, speed = 0.5 }) {
    const layerRef = useRef(null);
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: count }).map(() => ({
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            size: Math.random() * 2 + 1 + "px",
            delay: Math.random() * 5 + "s"
        }));

        setStars(generatedStars);
    }, [count]);

    useEffect(() => {
        if (window.matchMedia("(max-width: 768px)").matches) return;

        const handleMove = (e) => {
            if (!layerRef.current) return;

            const x = (e.clientX / window.innerWidth - 0.5) * speed * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * speed * 40;

            layerRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };

        window.addEventListener("mousemove", handleMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMove);
    }, [speed]);

    return (
        <div ref={layerRef} className="stars-layer">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        animationDelay: star.delay
                    }}
                />
            ))}
        </div>
    );
}