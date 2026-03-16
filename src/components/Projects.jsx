import React, { useState, useEffect, useRef } from "react";
import "./Projects.css";

const projectData = [
    {
        title: "Ballerino",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A 2D pixel-art online multiplayer football game featuring strategic card mechanics. Developed using Photon for real-time synchronization and competitive gameplay.",
        tech: ["Unity", "C#","Itch.io"],
        video: "/videos/ballerino4.mp4",
        poster: "/images/posters/ballerino_cover.png",
        link: "https://begumdonmez.itch.io/ballerino-online",
        team: [
            { name: "Bora Berk Coşgun",role: "Game Designer", link: "https://www.linkedin.com/in/bora-berk-coşgun-119a08202/" },
            { name: "Yiğit Ibrahim Erkal",role: "2D Artist", link: "https://www.instagram.com/yigitibrahimerkal/" }
        ]
    },
    {
        title: "Addiction",
        category: "Game Projects",
        role: "Game Developer",
        desc: "An impactful 2D bullet hell game developed to raise awareness about substance abuse, focusing on fast-paced mechanics and thematic storytelling.",
        tech: ["Unity", "C#"],
        video: "/videos/addiction.mp4",
        link: "#",
        team: [
            { name: "Fatma Beril Bilgen", role: "Game Designer",link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" },
            { name: "Bora Berk Coşgun", role: "Game Designer",link: "https://www.linkedin.com/in/bora-berk-coşgun-119a08202/" },
            { name: "Yiğit Ibrahim Erkal", role: "2D Artist",link: "https://www.instagram.com/yigitibrahimerkal/" },
            { name: "Eray Temel", role: "2D Artist",link: "#" }
            
        ]
    },
    {
        title: "Eco Guardian",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A top-down 2D prototype aimed at environmental advocacy, illustrating the impact of pollution on wildlife through interactive gameplay.",
        tech: ["Unity", "C#","social project"],
        video: "/videos/eco-guardian.mp4",
        link: "#",
        team: [
            { name: "Fatma Beril Bilgen",role: "Game Designer", link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" },
            { name: "Yiğit Ibrahim Erkal",role: "2D Artist", link: "https://www.instagram.com/yigitibrahimerkal/" }
        ]
    },
    {
        title: "GStellar Recon: Kepler",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A 2D top-down tower defense game featuring strategic gameplay improvements.",
        tech: ["Unity", "C#", "Tower Defence"],
        video: "/videos/gstellar.mp4",
        link: "#",
        team: [
            { name: "Suha Tasci",role: "Game Designer", link: "https://www.linkedin.com/in/süha-taşcı-54a429283/" },
            { name: "Bora Berk Coşgun",role: "Game Designer", link: "https://www.linkedin.com/in/bora-berk-coşgun-119a08202/" },
            { name: "Fatma Beril Bilgen", role: "2D Artist",link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" },
            { name: "Yiğit Ibrahim Erkal",role: "2D Artist", link: "https://www.instagram.com/yigitibrahimerkal/" },
            { name: "Enes Cerli",role: "2D Artist", link: "https://www.linkedin.com/in/enes-çerli-62b031280/" },
            { name: "Emre Bilici",role: "Game Developer",link: "https://emrebilici.com" }
        ]
    },
    {
        title: "Santa's House",
        category: "Game Projects",
        role: "Game Developer",
        desc: "A sweet game with Santa's elves at Ice Breaking Jam!\n" +
            "\n" +
            "Theme: Balance",
        tech: ["Unity", "C#", "Itch.io","Jam"],
        video: "/videos/santas-house.mp4",
        link: "https://begumdonmez.itch.io/noel-babann-evi",
        team: [
            { name: "Suha Tasci",role: "Game Designer", link: "https://www.linkedin.com/in/süha-taşcı-54a429283/" },
            { name: "Fatma Beril Bilgen", role: "2D Artist",link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" }
        ]
    },
    {
        title: "Kim Kam Olmak Ister?",
        category: "Game Projects",
        role: "Game Developer",
        desc: "An interactive trivia game inspired by Turkish Mythology, designed to blend educational content with engaging UI elements for a mythology course.",
        tech: ["Unity", "C#", "Quiz"],
        video: "/videos/kimkam.mp4",
        link: "#",
        team: [
            { name: "Fatma Beril Bilgen", role: "Game Designer",link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" },
            { name: "Koray Inci",role: "Game Developer", link: "https://www.linkedin.com/in/koray-inci-017b9227a/" },
            { name: "Muhammet Kerem Saraç",role: "2D Artist", link: "www.behance.net/keremsarac" },
        ]
    },
    {
        title: "Sultanahmet: Historical Layers",
        category: "Game Projects",
        role: "Developer",
        desc: "An educational project for Urban Culture and Aesthetics, utilizing Unity to visualize the architectural evolution of Sultanahmet Square across different historical eras.",
        tech: ["Unity", "C#", "Itch.io"],
        video: "/videos/sultanahmet.mp4",
        link: "https://begumdonmez.itch.io/sultanahmet"
    },
    {
        title: "Kadraj 1",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "The debut issue of 'Kadraj', established as a student-led independent news source to foster campus media engagement and creative storytelling.",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/kadraj1_dis.png", "/designs/kadraj1_ic.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" },
            { name: "Yiğit Ibrahim Erkal",role: "2D Artist",link: "https://www.instagram.com/yigitibrahimerkal/" }
        ]
    },
    {
        title: "Kadraj 2 - Halloween",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "We decided to release special issues for special occasions. We produced this issue for Halloween. We gathered illustrations and articles fitting the theme, and this is the issue that emerged.\n" +
            "Trick or treat!",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/hallowen_dis.png", "/designs/hallowen_dis_2.png", "/designs/hallowen_ic.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" }
        ],
        
    },
    {
        title: "Kadraj 3 - Oct 29th Republic Day",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "This is our special issue celebrating Republic Day, a day of great importance to us. Today, we express our eternal gratitude to our ancestors who gave us our Republic.",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/kadraj3_dis.png", "/designs/kadraj3_ic.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" }
        ]
    },
    {
        title: "Kadraj 4 - Mustafa Kemal Atatürk",
        category: "Fanzines",
        role: "Editor & Designer",
        desc:"In memory of our precious leader Mustafa Kemal Atatürk. With respect and gratitude!\n" +
            "1881 - 199∞",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/1.png", "/designs/2.png", "/designs/3.png", "/designs/4.png", "/designs/5.png"],
        link: "#",
    },
    {
        title: "Kadraj 5",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "Our colorful autumn-themed issue.",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/kadraj5_dis.png", "/designs/kadraj5_ic.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" }
        ]
    },
    {
        title: "Kadraj 6",
        category: "Fanzines",
        role: "Editor & Designer",
        desc: "We did our best to make each issue more special. In this issue, I wanted to interact with people through our Spotify account.",
        tech: ["Canva", "Fanzine"],
        images: ["/designs/kadraj6_dis.png", "/designs/kadraj6_ic.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" },
            { name: "Fatma Beril Bilgen", role: "2D Artist",link: "https://www.linkedin.com/in/beril-bilgen-12a927333/" }
        ]
    },
    {
        title: "Bumedya - Newspaper",
        category: "Designs",
        role: "Editor & Designer",
        desc: "This is a newspaper we published for Ramadan. We wanted to make the Ramadan culture, spanning from the Ottoman era to the Republic, both informative and entertaining.",
        tech: ["Canva", "Newspaper"],
        images: ["/designs/news1.png", "/designs/news2.png"],
        link: "#",
        team: [
            { name: "Emre Bilici",role: "Editor",link: "https://emrebilici.com" }
        ]
    },
    {
        title: "Baymax",
        category: "2D Projects",
        role: "Drawer",
        desc: "During our 2D animation class, I wanted to draw Baymax, one of my favorite characters from Big Hero 6. It's not fully finished, but I still wanted to share it because it turned out really cute.",
        tech: ["Illustrator", "Art"],
        images: ["/projects/baymax_room.gif", "/projects/baymax_main.gif"],
        link: "#"
    },
    {
        title: "Cuphead",
        category: "2D Projects",
        role: "Drawer",
        desc: "A Cuphead running animation I created as part of a 2D animation\n" +
            "Course. The animation was referenced from Dipper Pines from Gravity Falls. The eye add-on was my own idea." +
            "I focused on timing, squash and stretch, and keeping the animation flow playful to match the classic Cuphead",
        tech: ["Illustrator", "Art"],
        images: ["/projects/cuphead_video.mp4", "/projects/cuphead.gif", "/projects/cupghost.gif"],
        link: "#"
    },
    {
        title: "Boredom",
        category: "2D Projects",
        role: "Drawer",
        desc: "Life passes by before we even realize it. We are always rushing to keep up with something, doing what we're told to do.\n" +
            "But what do we actually want? What is our dream?\n" +
            "For our 2D animation class, we were asked to create an animation based on the theme of boredom. I see dreams as the colors of our lives without them, we get stuck in a colorless, unhappy, ordinary, and boring world.\n" +
            "This is how I chose to express boredom.",
        tech: ["Illustrator", "Art"],
        images: ["/projects/Boredom.mp4"],
        link: "#"
    }
];

const ProjectCard = ({ project, onTagClick, activeTag }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const nextImg = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
                {project.video && (
                    <video
                        src={project.video}
                        controls
                        preload="metadata"
                        poster={project.poster || "/images/project-cover.png"}
                        className="project-video"
                    >
                        Tarayıcınız video etiketini desteklemiyor.
                    </video>
                )}

                {project.images && (
                    <div className="carousel-container">
                        <img
                            src={project.images[currentImg]}
                            alt={`${project.title} - ${currentImg + 1}`}
                            className="project-image"
                        />
                        {project.images.length > 1 && (
                            <>
                                <button className="carousel-btn prev" onClick={prevImg}>‹</button>
                                <button className="carousel-btn next" onClick={nextImg}>›</button>
                                <div className="carousel-dots">
                                    {project.images.map((_, i) => (
                                        <div key={i} className={`dot ${currentImg === i ? 'active' : ''}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!project.video && !project.images && (
                    <div className="no-video-placeholder"><span>Preview Coming Soon</span></div>
                )}
            </div>

            <div className="project-info">
                <h3>{project.title}</h3>
                <h4>{project.role}</h4>
                <p>{project.desc}</p>
                <div className="tech-tags">
                    {project.tech.map((t, i) => (
                        <span
                            key={i}
                            onClick={() => onTagClick(t)}
                            className={activeTag === t ? "active-tag" : ""}
                            style={{ cursor: 'pointer' }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
                {project.team && (
                    <div className="project-team">
                        <span className="team-title">Team: </span>
                        {project.team.map((member, i) => (
                            <React.Fragment key={i}>
                                <a
                                    href={member.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="team-member-link"
                                >
                                    {member.name}
                                </a>
                                <span className="member-role"> ({member.role})</span>
                                {i < project.team.length - 1 ? " | " : ""}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-button">View Project</a>
            </div>
        </div>
    );
};

function Projects() {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedTag, setSelectedTag] = useState(null);
    const sectionRef = useRef(null);

    const tabs = ["All", "Game Projects", "2D Projects", "3D Projects", "Designs", "Fanzines"];

    useEffect(() => {
        if (selectedTag || activeTab !== "All") {
            sectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, [selectedTag, activeTab]);

    const filteredProjects = projectData.filter(project => {
        const categoryMatch = activeTab === "All" || project.category === activeTab;
        const tagMatch = !selectedTag || project.tech.includes(selectedTag);
        return categoryMatch && tagMatch;
    });

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
    };

    return (
        <section id="projects" className="projects-section" ref={sectionRef}>
            <h2 className="section-title">My Projects</h2>

            {selectedTag && (
                <div className="active-filter-info">
                    <span>Tag: <strong>{selectedTag}</strong></span>
                    <button onClick={() => setSelectedTag(null)} className="clear-tag-btn">✕ Clear</button>
                </div>
            )}

            <div className="project-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tab);
                            setSelectedTag(null);
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="projects-grid">
                {filteredProjects.map((project, index) => (
                    <ProjectCard
                        key={index}
                        project={project}
                        onTagClick={handleTagClick}
                        activeTag={selectedTag}
                    />
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="no-results">
                    <p>No projects found with this tag.</p>
                    <button onClick={() => {setActiveTab("All"); setSelectedTag(null);}} className="project-button">Clear Filters</button>
                </div>
            )}
        </section>
    );
}

export default Projects;