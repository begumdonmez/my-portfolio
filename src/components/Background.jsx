import React from "react";
import "./background.css";
import Stars from "./Stars";

export default function Background() {
    return (
        <div className="background-wrapper">
            {/* Base gradient */}
            <div className="background" />

            {/* Noise overlay */}
            <div className="noise" />

            {/* Glow spot */}
            <div className="glow" />

            {/* Stars layers */}
            <Stars count={100} speed={0.5} />
            <Stars count={60} speed={1} />
            <Stars count={30} speed={1.5} />
        </div>
    );
}