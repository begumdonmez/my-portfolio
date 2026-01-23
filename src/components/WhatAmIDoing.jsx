import "./WhatAmIDoing.css";
import MagicText from "./MagicText";

function WhatAmIDoing() {
    const playSound = (soundFile) => {
        const audio = new Audio(`/sounds/${soundFile}`);
        audio.volume = 0.15;
        audio.play().catch(err => console.log("Ses yüklenemedi:", err));
    };
    return (
        <section className="home-section what-i-do">
            <MagicText text="What am I doing?" />

            <p className="intro-text">
                I am a 4th-year Digital Game Design student, striving every day to achieve my dreams and create new ones! 
                I focus on game development, interactive storytelling, and continuously improving my skills in software development.
            </p>

            <div className="doing-section">
                <h2 className="section-title">Education</h2>
                <h3>Digital Game Design Undergraduate Program</h3>
                <p>
                    <strong>Beykoz University</strong> — [22/08/2022 – Current]  <br />
                    <em>EQF level 6</em><br />
                </p>
                <h3>High School Diploma</h3>
                <p>
                    <strong>Karacabey Ulviye Matlı Science High School</strong> — [17/09/2018 – 17/06/2022]  <br />
                    <em>EQF level 4</em><br />
                </p>
            </div>

            <div className="doing-section">
                <h2 className="section-title">Work Experience</h2>
                <p>
                    <strong>Carousel Game — Level Designer</strong> (06/2024 - 02/2025)  <br />
                    I worked as a level designer for a Match-3 game and was also involved in the testing phase of the project. I also took
                    on tasks such as taking meeting notes, planning, and reporting team work. I began training on using Jira and
                    managed the task management portion of Jira.
                </p>
            </div>

            <div className="doing-section">
                <h2 className="section-title">Projects</h2>
                <div className="project-item">
                    <h3>Addiction</h3>
                    <p>A 2D bullet hell game developed in a team of 5 where I acted as Game Developer, focusing on raising awareness about substance abuse.</p>
                </div>
                <div className="project-item">
                    <h3>Eco Guardian</h3>
                    <p>A 2D top-down game focused on environmental pollution and its effects on animals, where I served as Game Developer.</p>
                </div>
                <div className="project-item">
                    <h3>Stellar Recon: Kepler</h3>
                    <p>A 2D top-down tower defense game with upgradable features, developed in a 5-person team with me as Game Developer.</p>
                </div>
                <div className="project-item">
                    <h3>Santa's House</h3>
                    <p>A game jam project created for Ice Breaking Game Jam 3, where I acted as a Developer.</p>
                </div>
            </div>

            <div className="doing-section">
                <h2 className="section-title">Skills & Tools</h2>

                <div className="skill-group">
                    <h3>Programming</h3>
                    <div className="skill-tags">
                        <span className="skill-tag" onMouseEnter={() => playSound("wrak1.mp3")}>Unity</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("wrak2.mp3")}>C#</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("wrak3.mp3")}>JetBrains Rider</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("wrak4.mp3")}>GitHub Desktop</span> 
                    </div>
                </div>

                <div className="skill-group">
                    <h3>Art</h3>
                    <div className="skill-tags">
                        <span className="skill-tag" onMouseEnter={() => playSound("woice1.mp3")}>Blender</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("woice3.mp3")}>Adobe After Effects</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("woice2.mp3")}>Adobe Illustrator</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("woice1.mp3")}>Adobe Photoshop</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("woice3.mp3")}>Autodesk Maya</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("woice2.mp3")}>Procreate</span> 
                    </div>
                </div>
                <div className="skill-group">
                    <h3>Audio</h3>
                    <div className="skill-tags">
                        <span className="skill-tag" onMouseEnter={() => playSound("coin.wav")}>Reaper</span> 
                    </div>
                </div>

                <div className="skill-group">
                    <h3>Management & Documentation & Design</h3>
                    <div className="skill-tags">
                        <span className="skill-tag" onMouseEnter={() => playSound("blip.wav")}>Jira</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("iron.wav")}>Confluence</span>
                        <span className="skill-tag" onMouseEnter={() => playSound("din.wav")}>Notion</span>
                        <span className="skill-tag" onMouseEnter={() => playSound("whosh.wav")}>Google Suite</span> 
                        <span className="skill-tag" onMouseEnter={() => playSound("pop.wav")}>Canva</span>
                        
                    </div>
                </div>
            </div>

            <div className="doing-section">
                <h2 className="section-title">Language</h2>
                <div className="project-item">
                    <h3>Mother Tongue</h3>
                    <p>Turkish</p>
                </div>
                <div className="project-item">
                    <h3>Other</h3>
                    <p>English</p>
                </div>
            </div>
            
            <div className="doing-section">
                <h2 className="section-title">Volunteering</h2>
                <div className="project-item">
                    <h3>Founder & President – Beykoz University Media Club</h3>
                    <h4>[ 08/08/2025 – Current ] Beykoz University</h4>
                    <p> I founded and currently lead the Beykoz University Media Club to strengthen students’ sense of belonging and foster
                        campus engagement. The club actively operates as a creative media platform where students share writings,
                        photographs, reviews, and ideas, while also promoting cultural events and student achievements. We produce a
                        school fanzine, radio broadcasts, podcasts, and audiovisual content for cafeteria screens, and additionally organize
                        social events such as Game Nights to enhance student interaction.
                    </p>
                </div>
                <div className="project-item">
                    <h3>Member of the Board of Directors – Beykoz University City and Culture Club</h3>
                    <h4>[ 26/11/2024 – 12/03/2025 ] Beykoz University</h4>
                    <p>I was involved in event planning and other activities within this club, which operates at our school. Our goal is to
                        provide our members with positive experiences and cultural values.
                    </p>
                </div>
            </div>
            
            <div className="doing-section">
                <h2 className="section-title">Honours & Awards</h2>
                <h3>Beykoz University Rector's Certificate of Honor</h3>
                <p>It's an honor certificate given to students at our school who
                    achieve a semester-long GPA higher than 3.8. I earned this certificate by being listed twice.
                </p>
                <h3>Beykoz University Dean's Certificate of Honor</h3>
                <p>t's an honor certificate awarded to students who achieve a
                    semester-long GPA of 3.6 or higher at our school. I've earned the right to receive this certificate by meeting this
                    requirement for three semesters.
                </p>
            </div>

            <div className="doing-section">
                <h2 className="section-title">Hobbies & Interests</h2>
                <h3>Creative Writing</h3>
                <p> I have loved writing since I was little. Sometimes I write fiction, sometimes I express my own thoughts and
                    feelings through writing. During my education, I participated in various writing competitions, won medals and
                    received awards. Writing is both a passion for me and a powerful way to express myself. I continue to actively
                    participate in competitions.
                </p>
                <h3>Crime & Psychology</h3>
                <p> I like to do research on various cases, I am curious about the psychological elements in the communication
                    of criminals and security forces, criminal psychology and I like to watch videos and movies on these.
                </p>
                <h3>Books, Movies & TV Series</h3>
                <p>  I love reading books and watching movies and TV series. I love discovering new worlds or
                    stepping into a character's shoes and living those adventures. I think it gives me new perspectives and expands my
                    imagination and empathy. There are often times when I get so caught up in it that I lose track of time.
                </p>
            </div>
        </section>
    );
}

export default WhatAmIDoing;