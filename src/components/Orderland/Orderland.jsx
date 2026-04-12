import React from 'react';
import Wordle from './Wordle';
import OXO from './OXO';
import './Orderland.css';

function Orderland({ onBack }) {
    return (
        <div className="orderland-screen">
            {/* --- Sistem Anomalisi: Kırmızı Yıldızlar --- */}
            <div className="red-star" style={{ top: '15%', left: '20%', animationDelay: '0.5s' }}></div>
            <div className="red-star" style={{ top: '65%', left: '10%', animationDelay: '2.1s', width: '2px', height: '2px' }}></div>
            <div className="red-star" style={{ top: '40%', left: '85%', animationDelay: '1.2s' }}></div>
            <div className="red-star" style={{ top: '80%', left: '75%', animationDelay: '3.5s', width: '4px', height: '4px' }}></div>
            <div className="red-star" style={{ top: '25%', left: '60%', animationDelay: '0s' }}></div>
            <div className="red-star" style={{ top: '10%', left: '50%', animationDelay: '4.2s', width: '2px', height: '2px' }}></div>
            <div className="red-star" style={{ top: '90%', left: '30%', animationDelay: '1.8s' }}></div>

            <div className="welcome-card fade-in">
                {/* --- Başlık ve Slogan Bölümü --- */}
                <h1 className="orderland-welcome">Welcome to Orderland!</h1>
                <p className="orderland-slogan">
                    The rabbit led you here. Now, face the glitch.
                </p>

                {/* --- MODÜL 001: Kelime Protokolü --- */}
                <div className="module-wrapper">
                    <Wordle />
                </div>

                {/* --- MODÜL 001: Kelime Protokolü --- */}
                <div className="module-wrapper">
                    <OXO />
                </div>

                {/* --- Çıkış Protokolü --- */}
                <div className="exit-section">
                    <button onClick={onBack} className="back-button">
                        Return to Reality
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Orderland;