import React, { useState, useRef } from "react";
import "./AudioMaker.css";

function AudioMaker() {
    
    const playlist = ["muzik1.mp3", "muzik2.mp3", "music3.mp3"];

    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(null); 

    const handleToggleMusic = () => {
        // Eğer hali hazırda bir müzik çalıyorsa durdur
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (currentIndex === playlist.length) {
            console.log("Müzik durduruldu, bir sonraki tıklama listeyi başlatacak.");
            setCurrentIndex(0); // Bir sonraki tıklama için indeksi başa sar
            return; // Fonksiyondan çık, hiçbir şey çalma
        }

        // Yeni şarkıyı seç ve oynat
        const soundFile = playlist[currentIndex];
        const newAudio = new Audio(`/musics/${soundFile}`);
        newAudio.volume = 0.15;

        newAudio.play().catch(err => console.log("Müzik yüklenemedi:", err));
        audioRef.current = newAudio; // Yeni sesi referansa ata

        setCurrentIndex(currentIndex + 1);
    };

    return (
        <button className="music-fab" onClick={handleToggleMusic}>
            <img src="/musictrack.png" alt="Müzik Çal" />
        </button>
    );
}

export default AudioMaker;