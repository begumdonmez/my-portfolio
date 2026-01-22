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

        // Yeni şarkıyı seç ve oynat
        const soundFile = playlist[currentIndex];
        const newAudio = new Audio(`/musics/${soundFile}`);
        newAudio.volume = 0.15;

        newAudio.play().catch(err => console.log("Müzik yüklenemedi:", err));
        audioRef.current = newAudio; // Yeni sesi referansa ata

        // Bir sonraki tıklama için indeksi güncelle (liste bitince başa döner)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    return (
        <button className="music-fab" onClick={handleToggleMusic}>
            <img src="/musictrack.png" alt="Müzik Çal" />
        </button>
    );
}

export default AudioMaker;