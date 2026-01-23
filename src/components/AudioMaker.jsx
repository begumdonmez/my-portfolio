import React, { useState, useRef } from "react";
import "./AudioMaker.css";

function AudioMaker() {
    const playlist = ["muzik1.mp3", "muzik2.mp3", "music3.mp3"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleToggleMusic = () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        const soundFile = playlist[currentIndex];
        const audio = new Audio(`/musics/${soundFile}`);
        audio.volume = 0.15;

        audio.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.log("Müzik yüklenemedi:", err));

        audio.onended = () => {
            setIsPlaying(false);
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
        };

        audioRef.current = audio;
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
