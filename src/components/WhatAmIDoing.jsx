import "./WhatAmIDoing.css";
import MagicText from "./MagicText";

function WhatAmIDoing() {
    return (
        <section className="home-section what-i-do">

            <MagicText text="What am I doing?" />

            <p className="intro-text">
                I'm Begüm. I'm a 4th-year Digital Game Design student.
                I didn't want to create a boring CV, so I built this website
                to reflect who I am and what I enjoy creating.
            </p>

            <div className="doing-section">
                <h2>Education</h2>
                <p>
                    B.Sc. in Digital Game Design — 4th Year<br />
                    GPA: 3.72
                </p>
            </div>

            <div className="doing-section">
                <h2>Work Experience</h2>
                <p>
                    Level Design Intern — Match-3 Game Studio<br />
                    Designed levels, worked on editors & balancing.
                </p>
            </div>

            <div className="doing-section">
                <h2>Skills</h2>
                <ul>
                    <li>Unity (C#)</li>
                    <li>Unreal Engine</li>
                    <li>Game & Level Design</li>
                    <li>React, HTML, CSS</li>
                </ul>
            </div>

            <div className="doing-section">
                <h2>Volunteering</h2>
                <p>Game jams & community-based projects.</p>
            </div>

            <div className="doing-section">
                <h2>Honors & Awards</h2>
                <p>Dean’s Honor List, Academic Excellence Award</p>
            </div>

        </section>
    );
}

export default WhatAmIDoing;
