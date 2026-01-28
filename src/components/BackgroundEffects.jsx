import React, { useEffect, useState } from 'react';
import './BackgroundEffects.css';

const BackgroundEffects = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Mouse koordinatlarını normalize ederek parallax etkisi yaratıyoruz
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="bg-effects-container">
            {/* NOISE/GRAIN: Sayfaya premium film dokusu verir */}
            <div className="grain-overlay"></div>

            {/* VOLUMETRIC BLOBS: Mouse hareketine farklı tepki veren derinlik katmanları */}
            <div
                className="blob blob-1"
                style={{
                    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
                }}
            ></div>
            <div
                className="blob blob-2"
                style={{
                    transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`
                }}
            ></div>

            {/* AMBIENT LIGHT: Alt kısımdan gelen hafif ışık kaynağı */}
            <div className="ambient-light"></div>
        </div>
    );
};

export default BackgroundEffects;