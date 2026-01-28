import { useEffect, useRef, useState } from "react";
import TarotCard from "./TarotCard";

function AboutSection() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting);
            },
            { threshold: 0.4 }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-cards">
            <TarotCard variant="back" />
            <TarotCard
                title="The Seeker"
                subtitle="Game designer crafting systems, emotions and quiet moments."
                variant="front"
            />
        </div>

    );
}

export default AboutSection;
