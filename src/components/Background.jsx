import React from "react";
import "./background.css";
import Stars from "./Stars";

const isMobile = window.matchMedia("(max-width: 768px)").matches;

export default function Background() {
    return (
        <div className="background-wrapper">
            <div className="background" />
            <div className="noise" />
            <div className="glow" />
            <Stars count={isMobile ? 45 : 100} speed={0.5} />
            <Stars count={isMobile ? 25 : 60} speed={1} />
            {!isMobile && <Stars count={30} speed={1.5} />}
        </div>
    );
}