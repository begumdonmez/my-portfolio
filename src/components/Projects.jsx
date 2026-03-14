import "./Projects.css";

const projectData = [
    {
        title: "Ballerino",
        role: "Game Developer",
        desc: "2D pixel-art, online multiplayer football game with strategic card mechanics.",
        tech: ["Unity", "C#", "Photon"],
        video: "/videos/ballerino.mp4", // Asset klasöründeki yol [cite: 46, 49]
        link: "https://begumdonmez.itch.io/ballerino-online"
    },
    {
        title: "Addiction",
        role: "Game Developer",
        desc: "2D bullet hell game developed to raise awareness about substance abuse.",
        tech: ["Unity", "C#"],
        video: "/videos/addiction.mp4", 
link: "#"
},
{
    title: "Eco Guardian",
        role: "Game Developer",
    desc: "A top-down 2D game prototype aimed at raising awareness about environmental pollution and its impact on animals.",
    tech: ["Unity", "C#", "GitHub"],
    video: "/videos/eco-guardian.mp4",
    link: "#"
},
{
    title: "GStellar Recon: Kepler",
        role: "Game Developer",
    desc: "A 2D top-down tower defense game featuring strategic gameplay improvements.",
    tech: ["Unity", "C#", "Version Control"],
    video: "/videos/gstellar.mp4",
    link: "#"
},
{
    title: "Santa's House",
        role: "Game Developer",
    desc: "A Game Jam project developed within 48 hours, focusing on ice-breaking mechanics and festive themes.",
    tech: ["Unity", "C#", "Itch.io"],
    video: "/videos/santas-house.mp4", 
    link: "https://begumdonmez.itch.io/noel-babann-evi" 
}
];

function Projects() {
    return (
        <section id="projects" className="projects-section">
            <h2 className="section-title">My Projects</h2>
            <div className="projects-grid">
                {projectData.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-video-container">
                            {/* NULL KONTROLÜ BURADA YAPILIYOR */}
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
                                /* Video yoksa görünecek kısım */
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