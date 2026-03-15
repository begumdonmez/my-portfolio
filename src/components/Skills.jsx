import React from 'react';
import './Skills.css';

const skillsData = [
    {
        category: "Programming & Engines",
        items: ["Unity", "Unreal Engine", "C#", "Python", "GitHub", "JetBrains Rider"] // 
    },
    {
        category: "Visual Arts",
        items: ["Blender", "Adobe After Effects", "Illustrator", "Photoshop", "Autodesk Maya", "Procreate"] // [cite: 31]
    },
    {
        category: "Sound Design",
        items: ["Reaper"] // 
    },
    {
        category: "Design & Management",
        items: ["Canva", "Jira", "Confluence", "Google Workspace"] // [cite: 35]
    }
];

function Skills() {
    return (
        <section id="skills" className="skills-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
                {skillsData.map((skillGroup, index) => (
                    <div key={index} className="skill-category-card">
                        <h3>{skillGroup.category}</h3>
                        <div className="skill-items">
                            {skillGroup.items.map((item, i) => (
                                <span key={i} className="skill-badge">{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;