import React from "react";
import "./World2D.css";

function World2D() {
    return (
        <section className="showcase-section">
            <h2 className="section-title">2D WORLD</h2>

            <div className="world2d-grid">

                {/* BOREDOM */}
                <div className="project">
                    <h3 className="project-title">Boredom</h3>

                    <div className="project-row">
                        <div className="project-text">
                            <p>
                                Can sıkıntısı konulu çizgi animasyon. Hayatımız boyunca bir akışa kapılıp gidiyoruz.
                                Hayat renklerle daha güzel. Akışa kapılma, akışı kendin oluştur.
                            </p>
                        </div>

                        <div className="project-visual">
                            <video
                                className="with-shadow"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/projects/Boredom.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>
                </div>

                {/* CUPHEAD */}
                <div className="project">
                    <h3 className="project-title">Cuphead</h3>

                    <div className="project-row">
                        <div className="project-text">
                            <p>
                                A Cuphead running animation I created as part of a 2D animation course.
                                The animation was referenced from Dipper Pines from Gravity Falls.
                                The eye add-on was my own idea.
                            </p>
                        </div>

                        <div className="project-visual">
                            <video
                                className="with-shadow"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/projects/cuphead_video.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>

                    <div className="project-row">
                        <div className="project-visual">
                            <img
                                src="/projects/cuphead.gif"
                                alt="Cuphead Animation"
                                className="with-shadow"
                            />
                        </div>

                        <div className="project-text">
                            <p>
                                I focused on timing, squash and stretch, and keeping the animation flow playful
                                to match the classic Cuphead style.
                            </p>
                        </div>
                    </div>

                    {/* SHADOWSUZ GÖRSEL */}
                    <div className="project-row image-only">
                        <div className="project-visual">
                            <img
                                src="/projects/cupghost.gif"
                                alt="Cuphead Ghost"
                            />
                        </div>
                    </div>
                </div>

                {/* BAYMAX */}
                <div className="project">
                    <h3 className="project-title">Baymax</h3>

                    <div className="project-row">
                        <div className="project-visual">
                            <img
                                src="/projects/baymax_main.gif"
                                alt="Baymax"
                                className="with-shadow"
                            />
                        </div>

                        <div className="project-text">
                            <p>
                                During our 2D animation class, I wanted to draw Baymax,
                                one of my favorite characters from Big Hero 6.
                                It’s not fully finished, but I still wanted to share it because it turned out really cute.
                            </p>
                        </div>
                    </div>

                    <div className="project-row image-only right">
                        <div className="project-visual">
                            <img
                                src="/projects/baymax_room.gif"
                                alt="Baymax Room"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default World2D;
