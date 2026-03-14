import "./Projects.css";

const projectData = [
    {
        title: "Ballerino Ballerino",
        role: "Game Developer",
        desc: "2D pixel-art, online multiplayer football game with strategic card mechanics.",
        tech: ["Unity", "C#", "Photon"],
        link: "#" // Buraya Itch.io linkini koyabilirsin
    },
    {
        title: "Addiction",
        role: "Game Developer",
        desc: "2D bullet hell game developed to raise awareness about substance abuse.",
        tech: ["Unity", "C#"],
        link: "#"
    },
   
];

function Projects() {
    return (
        <section id="projects" className="projects-section">
            <h2 className="section-title">My Projects</h2>
            <div className="projects-grid">
                {projectData.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-image-placeholder">
                            {/* Buraya projelerin kapak resimleri gelecek */}
                        </div>
                        <div className="project-info">
                            <h3>{project.title}</h3>
                            <h4>{project.role}</h4>
                            <p>{project.desc}</p>
                            <div className="tech-tags">
                                {project.tech.map((t, i) => <span key={i}>{t}</span>)}
                            </div>
                            <a href={project.link} className="project-button">View Project</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Projects;