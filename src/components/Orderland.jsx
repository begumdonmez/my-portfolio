import React from 'react';

function Orderland({ onBack }) {
    return (
        <div className="orderland-screen fade-in">
            <h1 className="orderland-welcome">Welcome to Orderland!</h1>

            <div className="playground-content">
                {/* Gelecekteki oyunlar ve içerikler buraya eklenecek */}
                <p style={{ color: 'white', opacity: 0.6, marginBottom: '30px' }}>
                    The playground is currently under construction...
                </p>
            </div>

            <button onClick={onBack} className="back-button">
                Return to Reality
            </button>
        </div>
    );
}

export default Orderland;