import React from 'react';
import "./World2D.css";

function World2D() {
    return (
        <section className="showcase-section">
            <h2 className="section-title">2D WORLD</h2>
            <div className="world2d-grid">

                {/* CUPHEAD: Video Sağda, Yazı ve Alt Görsel Solda */}
                <div className="project-row right-visual">
                    <div className="project-details">
                        <div className="text-content">
                            <h3>Cuphead</h3>
                            <p>
                                1930'lar çizgi film estetiğiyle hazırladığım
                                karakter tasarımları ve animasyon denemeleri.
                            </p>
                        </div>
                        <div className="sub-visual">
                            {/* Buraya Cuphead ile ilgili başka bir resim veya boş bırakabilirsin */}
                            <img src="/projects/cuphead.gif" alt="Cuphead Background" />
                        </div>
                    </div>
                    <div className="hero-visual">
                        {/* VIDEO BURADA */}
                        <video
                            className="project-video"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/projects/cuphead_video.mp4" type="video/mp4" />
                            Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                    </div>
                </div>

                {/* BAYMAX: Ana Görsel Solda, Yazı ve Alt Görsel Sağda */}
                <div className="project-row left-visual">
                    <div className="hero-visual">
                        <img src="/projects/baymax_main.gif" alt="Baymax Concept" />
                    </div>
                    <div className="project-details">
                        <div className="text-content">
                            <h3>Baymax</h3>
                            <p>Baymax karakter tasarımı ve izometrik oda kurgusu.</p>
                        </div>
                        <div className="sub-visual">
                            <img src="/projects/baymax_room.gif" alt="Baymax Room" />
                        </div>
                    </div>
                </div>

                
                <div className="project-row right-visual">
                    <div className="project-details">
                        <div className="text-content">
                            <h3>Boredom</h3>
                            <p>
                                Can sıkıntısı konulu çizgi animasyon. Hayatımız boyunca bir akışa kapılıp gidiyoruz.
                                Hayat renklerle daha güzel. Akışa kapılma akışı kendin oluştur.
                            </p>
                        </div>
                      
                    </div>
                    <div className="hero-visual">
                        
                        <video
                            className="project-video"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/projects/Boredom.mp4" type="video/mp4" />
                            Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default World2D;