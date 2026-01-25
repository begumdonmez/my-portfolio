import React from "react";
import "./popup.css";

function Popup({ type, onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                {type === "welcome" && (
                    <>
                        <h3>Welcome ✨</h3>
                        <p>
                            This is my little corner where I share my 2D worlds,
                            animations and drawings. Have fun exploring 🌱
                        </p>
                    </>
                )}

                {type === "return" && (
                    <>
                        <h3>Hey 👀</h3>
                        <p>
                            Where did you go?
                            You were in the middle of exploring 🎨
                        </p>
                    </>
                )}

                <button onClick={onClose}>Let’s continue</button>
            </div>
        </div>
    );
}

export default Popup;
