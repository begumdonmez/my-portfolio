import "./Home.css";
import { useEffect } from "react";
import BackgroundEffects from '../components/BackgroundEffects';

function Home() {
    useEffect(() => {
        // TV açılış efekti (Scanline / CRT etkisi)
        const overlay = document.querySelector(".tv-overlay");
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add("tv-off");
            }, 1200);
        }
    }, []);

    return (
        <div className="home-root">
            {/* KATMAN 1: TV AÇILIŞ OVERLAY (En Üstte) */}
            <div className="tv-overlay" />

            {/* KATMAN 2: SİNEMATİK ARKA PLAN (Blobs & Noise) */}
            <BackgroundEffects />

            {/* KATMAN 3: PARTICLE SİSTEMİ (Organik ve Dağınık) */}
            <div className="bg-3d">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`particle p${(i % 5) + 1}`} />
                ))}
            </div>

            {/* KATMAN 4: ANA İÇERİK */}
            <section className="hero-section">
                <div className="image-wrapper">
                    <img
                        src="/begu.png"
                        alt="Begüm Dönmez"
                        className="hero-image"
                    />
                </div>

                <h1 className="hero-title">Begüm Dönmez</h1>
                <p className="hero-subtitle">
                    Game Designer · Level Designer · Creative Technologist
                </p>

                <div className="hero-buttons">
                    <button className="primary-btn">Load Info</button>
                    <button className="secondary-btn">View Projects</button>
                </div>
            </section>
        </div>
    );
}

export default Home;