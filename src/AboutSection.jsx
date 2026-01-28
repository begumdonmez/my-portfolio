import { useEffect, useRef } from "react";
import TarotCard from "./TarotCard";

function AboutSection() {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current.classList.add("active");
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(ref.current);
    }, []);

    return (
        <section className="about-section">
            <div ref={ref} className="about-cards reveal">
                {/* BEN */}
                <TarotCard
                    open={true}
                    title="The Seeker"
                    subtitle="A game designer shaping systems and emotions through play."
                />

                {/* DETAYLAR */}
                <TarotCard
                    open={false}
                    title="The Chronicle"
                    subtitle={`Digital Game Designer
Level Design • Puzzle Systems
Unity • C# • React`}
                />
            </div>
        </section>
    );
}

export default AboutSection;
