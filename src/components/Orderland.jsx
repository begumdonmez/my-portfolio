import React from 'react';

function Orderland({ onBack }) {
    return (
        <div className="orderland-screen">
            {/* Yazı ve kareleri içine alan ana panel */}
            <div className="welcome-card fade-in">
                <h1 className="orderland-welcome">Welcome to Orderland!</h1>

                <div className="placeholder-grid">
                    <div className="placeholder-square"></div>
                    <div className="placeholder-square"></div>
                    <div className="placeholder-square"></div>
                    <div className="placeholder-square"></div>
                    <div className="placeholder-square"></div>
                </div>
                <div className="playground-content">
                    <p style={{ color: 'white', opacity: 0.6, marginBottom: '30px' }}>
                        The playground is currently under construction...
                    </p>
                </div>
                <button onClick={onBack} className="back-button">
                    Return to Reality
                </button>
            </div>
        </div>
    );
}

export default Orderland;