import React from 'react';
import './Skills.css';
const hoverSfx = "/sounds/over.mp3";

const skillsData = [
    {
        category: "Programming & Engines",
        items: ["Unity", "Unreal Engine", "C#", "GitHub", "JetBrains Rider"]
    },
    {
        category: "Visual Arts",
        items: ["Blender", "Adobe After Effects", "Illustrator", "Photoshop", "Autodesk Maya", "Procreate"] 
    },
    {
        category: "Sound Design",
        items: ["Reaper"] // 
    },
    {
        category: "Design & Management",
        items: ["Canva", "Jira", "Google Workspace"] 
    }
];

function Skills() {
    // Ses çalma fonksiyonu
    const playHoverSound = () => {
        const audio = new Audio(hoverSfx);
        audio.volume = 0.1;
        audio.play().catch(err => console.log("Ses çalma hatası:", err));
    };
    return (
        <section id="skills" className="skills-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
                {skillsData.map((skillGroup, index) => (
                    <div key={index} className="skill-category-card">
                        <h3>{skillGroup.category}</h3>
                        <div className="skill-items">
                            {skillGroup.items.map((item, i) => (
                                <span key={i} 
                                      className="skill-badge"
                                      onMouseEnter={playHoverSound}
                                >{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;