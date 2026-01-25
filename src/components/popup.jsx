import React from "react";
import "./popup.css";

function Popup({ type, onClose }) {
    return (
        <div className="popup-overlay">
            <div className={`popup ${type}`}>

                {type === "welcome" && (
                    <>
                        <h3>Welcome ✨</h3>
                        <p>
                            This is my little corner where I share my 2D worlds,
                            animations and drawings. Have fun exploring 🌱
                        </p>
                    </>
                )}

                {type === "welcomeBack" && (
                    <>
                        <h3>Welcome back 🤍</h3>
                        <p>
                            Glad to see you again.
                            Let’s keep exploring where you left off 🎨
                        </p>
                    </>
                )}

                {type === "resume" && (
                    <>
                        <h3>Hey 👀</h3>
                        <p>
                            You were right in the middle of something.
                            Let’s continue ✨
                        </p>
                    </>
                )}

                <button onClick={onClose}>Let’s continue</button>
            </div>
        </div>
    );
}

export default Popup;
