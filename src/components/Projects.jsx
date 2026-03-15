import React, { useState } from "react";
import "./Projects.css";

const projectData = [
    {
        title: "Ballerino",
        category: "Game Projects",
        role: "Game Developer",
        desc: "2D pixel-art, online multiplayer football game with strategic card mechanics.",
        tech: ["Unity", "C#"],
        video: "/videos/ballerino.mp4",
        link: "https://begumdonmez.itch.io/ballerino-online"
    },
    {
        title: "Addiction",
        category: "Game Projects",
        role: "Game Developer",
        desc: "2D bullet hell game developed to raise awareness about substance abuse.",
        tech: ["Unity", "C#"],
        video: "/videos/addiction.mp4",
        link: "#"
    },
    {
        title: "Eco Guardian",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A top-down 2D game prototype aimed at raising awareness about environmental pollution.",
        tech: ["Unity", "C#", "GitHub"],
        video: "/videos/eco-guardian.mp4",
        link: "#"
    },
    {
        title: "GStellar Recon: Kepler",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A 2D top-down tower defense game featuring strategic gameplay improvements.",
        tech: ["Unity", "C#", "Version Control"],
        video: "/videos/gstellar.mp4",
        link: "#"
    },
    {
        title: "Santa's House",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A Game Jam project developed within 48 hours, focusing on ice-breaking mechanics.",
        tech: ["Unity", "C#", "Itch.io"],
        video: "/videos/santas-house.mp4",
        link: "https://begumdonmez.itch.io/noel-babann-evi"
    },
    {
        title: "Kadraj 1",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [

            "/designs/kadraj1_dis.png",
            "/designs/kadraj1_ic.png"
        ],
        link: "#"
    },
    {
        title: "Kadraj 2 - Halloween",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [
            
            "/designs/hallowen_dis.png",
            "/designs/hallowen_dis_2.png",
            "/designs/hallowen_ic.png"
        ],
        link: "#"
    },
    {
        title: "Kadraj 3 - Oct 29th Republic Day ",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [

            "/designs/kadraj3_dis.png",
            "/designs/kadraj3_ic.png"
        ],
        link: "#"
    },
    {
        title: "Kadraj 4 - Mustafa Kemal Atatürk ",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [

            "/designs/1.png",
            "/designs/2.png",
            "/designs/3.png",
            "/designs/4.png",
            "/designs/5.png"
        ],
        link: "#"
    },
    {
        title: "Kadraj 5 ",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [

            "/designs/kadraj5_dis.png",
            "/designs/kadraj5_ic.png"
        ],
        link: "#"
    },
    {
        title: "Kadraj 6 ",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Fanzine"],
        images: [

            "/designs/kadraj6_dis.png",
            "/designs/kadraj6_ic.png"
        ],
        link: "#"
    },
    {
        title: "Bumedya - Newspaper",
        category: "Designs",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture and visual storytelling.",
        tech: ["Canva","Newspaper"],
        images: [

            "/designs/news1.png",
            "/designs/news2.png"
        ],
        link: "#"
    }
    
];

const ProjectCard = ({ project }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const nextImg = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Butona tıklayınca kartın genel linkini tetiklememesi için
        setCurrentImg((prev) => (prev + 1) % project.images.length);
    };

    const prevImg = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    return (
        <div className="project-card">
            <div className="project-video-container">
                {/* EĞER VİDEO VARSA */}
                {project.video && (
                    <video
                        src={project.video}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                        className="project-video"
                    />
                )}

                {/* EĞER KAYDIRMALI RESİMLER VARSA */}
                {project.images && (
                    <div className="carousel-container">
                        <img
                            src={project.images[currentImg]}
                            alt={`${project.title} - ${currentImg + 1}`}
                            className="project-image"
                        />
                        <button className="carousel-btn prev" onClick={prevImg}>‹</button>
                        <button className="carousel-btn next" onClick={nextImg}>›</button>
                        <div className="carousel-dots">
                            {project.images.map((_, i) => (
                                <div key={i} className={`dot ${currentImg === i ? 'active' : ''}`} />
                            ))}
                        </div>
                    </div>
                )}

                {/* HİÇBİRİ YOKSA */}
                {!project.video && !project.images && (
                    <div className="no-video-placeholder"><span>Preview Coming Soon</span></div>
                )}
            </div>

            <div className="project-info">
                <h3>{project.title}</h3>
                <h4>{project.role}</h4>
                <p>{project.desc}</p>
                <div className="tech-tags">
                    {project.tech.map((t, i) => <span key={i}>{t}</span>)}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-button">View Project</a>
            </div>
        </div>
    );
};

function Projects() {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Game Projects", "2D Projects", "3D Projects", "Designs","Fanzines"];

    const filteredProjects = activeTab === "All"
        ? projectData
        : projectData.filter(p => p.category === activeTab);

    return (
        <section id="projects" className="projects-section">
            <h2 className="section-title">My Projects</h2>
            <div className="project-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="projects-grid">
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </div>
        </section>
    );
}

export default Projects;