import React from 'react';

function World2D() {
    return (
        <section className="showcase-section">
            <h2>2D WORLD</h2>
            <div className="project-list">

                {/* Baymax Projesi */}
                <div className="project-card">
                    <div className="project-media">
                        <img src="/projects/baymax_main.gif" alt="Baymax Concept" />
                        <img src="/projects/baymax_room.gif" alt="Baymax Room" className="sub-img" />
                    </div>
                    <div className="project-content">
                        <h3>Baymax: Isometric Room</h3>
                        <p>
                            İzometrik bakış açısıyla tasarlanmış bir oda ve karakter çalışması.
                            Işıklandırma ve detaylar üzerine odaklanılmıştır.
                        </p>
                    </div>
                </div>

                {/* Cuphead Projesi */}
                <div className="project-card">
                    <div className="project-media">
                        <img src="/projects/cuphead_style.png" alt="Cuphead Style" />
                    </div>
                    <div className="project-content">
                        <h3>Cuphead Style Asset</h3>
                        <p>1930'lar çizgi film estetiğiyle hazırlanmış karakter ve çevre tasarımları.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default World2D;