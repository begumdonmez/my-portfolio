import React from 'react';
import "./World2D.css";

function World2D() {
    return (
        <section className="showcase-section">
            <h2 className="section-title">2D WORLD</h2>
            <div className="world2d-grid">

                <div className="project-row right-visual">
                    <div className="project-details align-left">
                        <h3>Boredom</h3>
                        <div className="text-content">
                            <p>
                                Can sıkıntısı konulu çizgi animasyon. Hayatımız boyunca bir akışa kapılıp gidiyoruz.
                                Hayat renklerle daha güzel. Akışa kapılma akışı kendin oluştur.
                            </p>
                        </div>
                        {/* Alt görsel (sub-visual) eklenmediği için burası boş kalacak */}
                    </div>
                    <div className="hero-visual">
                        <video className="project-video" autoPlay loop muted playsInline>
                            <source src="/projects/Boredom.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>

                
                <div className="project-row right-visual">
                    <div className="project-details align-left">
                        <h3>Cuphead</h3>
                        <div className="text-content">
                            <p>
                                A Cuphead running animation I created as part of a 2D animation course. 
                                The animation was referenced from the character Dipper Pines from Gravity Falls. 
                                The eye add-on was my own idea. The background was also designed by me using Cuphead characters and elements.
                            </p>
                        </div>
                        <div className="sub-visual">
                            <img src="/projects/cuphead.gif" alt="Cuphead Animation" />
                        </div>
                        
                        <div className="text-content">
                            <p>
                                I focused on timing, squash and stretch, and keeping the animation flow playful
                                to match the classic Cuphead style.
                            </p>
                        </div>

                        {/* EKSTRA GÖRSEL */}
                        <div className="sub-visual">
                            <img src="/projects/cuphead_sketch.png" alt="Cuphead Sketches" />
                        </div>
                    </div>

                
                    
                    <div className="hero-visual">
                        <video className="project-video" autoPlay loop muted playsInline>
                            <source src="/projects/cuphead_video.mp4" type="video/mp4" />
                        </video>
                    </div>
                    
                </div>

                
                <div className="project-row left-visual">
                    <div className="sub-visual">
                        <img src="/projects/baymax_main.gif" alt="Baymax" />
                    </div>
                    <div className="project-details align-right">
                        <h3>Baymax</h3>
                        <div className="text-content">
                            <p>
                                During our 2D animation class, I wanted to draw Baymax, one of my favorite characters from Big Hero 6. 
                                It’s not fully finished, but I still wanted to share it because it turned out really cute. </p>
                        </div>
                        <div className="sub-visual">
                            <img src="/projects/baymax_room.gif" alt="Baymax Room" />
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}

export default World2D;