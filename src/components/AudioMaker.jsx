import React, { useState, useRef, useEffect } from "react";
import "./AudioMaker.css";

function AudioMaker() {
    const playlist = ["muzik1.mp3", "muzik2.mp3", "music3.mp3"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Tek bir audio nesnesi oluşturuyoruz
    const audioRef = useRef(new Audio());

    // Şarkı kaynağını ve ses seviyesini yöneten efekt
    useEffect(() => {
        const audio = audioRef.current;
        audio.src = `/musics/${playlist[currentIndex]}`;
        audio.volume = 0.15;

        // Otomatik geçiş: Şarkı biterse bir sonrakine geç
        const handleAutoNext = () => {
            if (currentIndex === playlist.length - 1) {
                // Son şarkı bittiyse durdur ve başa sar
                setIsPlaying(false);
                setCurrentIndex(0);
            } else {
                // Değilse sonrakine geç
                setCurrentIndex((prev) => prev + 1);
            }
        };

        audio.addEventListener("ended", handleAutoNext);

        if (isPlaying) {
            audio.play().catch(err => console.log("Oynatma hatası:", err));
        }

        return () => audio.removeEventListener("ended", handleAutoNext);
    }, [currentIndex, isPlaying]);

    const handleToggleMusic = () => {
        const audio = audioRef.current;

        if (!isPlaying) {
            // Müzik çalmıyorsa başlat (0. indexten başlar)
            setIsPlaying(true);
        } else {
            // Müzik çalıyorsa:
            if (currentIndex === playlist.length - 1) {
                // 1. Eğer son şarkıdaysak: Durdur ve indeksi sıfırla
                audio.pause();
                setIsPlaying(false);
                setCurrentIndex(0);
            } else {
                // 2. Eğer son şarkı değilse: Bir sonraki şarkıya geç
                setCurrentIndex((prev) => prev + 1);
            }
        }
    };

    return (
        <button className="music-fab" onClick={handleToggleMusic}>
            {isPlaying ? (
                <img src="/musictrack2.gif" alt="Müzik Çalıyor" />
            ) : (
                <img src="/musictrack1.png" alt="Müzik Durduruldu" />
            )}
        </button>
    );
}

export default AudioMaker;