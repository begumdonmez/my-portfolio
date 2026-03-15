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
        title: "Bumedya Fanzin",
        category: "Designs",
        role: "Editor & Designer",
        desc: "A collaborative fanzine design focusing on media culture.",
        tech: ["Canva", "Photoshop"],
        images: ["/designs/fanzin1.png", "/designs/fanzin2.png", "/designs/fanzin3.png"], // PNG'lerini buraya ekle
        link: "#"
    
    }
];

function Projects() {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Game Projects", "2D Projects", "3D Projects", "Designs"];

    const filteredProjects = activeTab === "All"
        ? projectData
        : projectData.filter(project => project.category === activeTab);

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
                    <div key={index} className="project-card">
                        <div className="project-video-container">
                            {project.video ? (
                                <video
                                    src={project.video}
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => e.target.play()}
                                    onMouseLeave={(e) => {
                                        e.target.pause();
                                        e.target.currentTime = 0;
                                    }}
                                    className="project-video"
                                />
                            ) : (
                                <div className="no-video-placeholder">
                                    <span>Preview Coming Soon</span>
                                </div>
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
                ))}
            </div>
        </section>
    );
}

export default Projects;