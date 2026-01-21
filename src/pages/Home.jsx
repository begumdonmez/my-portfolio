import "./Home.css";

function Home() {
    return (
        <div className="home">
            <div className="home-content">
                <section className="home-section">
                    <h1>Who am I?</h1>
                    <p>
                        I'm Begüm. I'm a 4th-year Digital Game Design student. I didn't want to create a boring CV, so I thought, "Why not write a website that reflects me?" and that's how I started. Here you can find something from every area I'm interested in. I hope it's a fun journey!
                    </p>
                </section>

                <section className="home-section">
                    <h1>What am I doing?</h1>
                    <p>
                        I focus on game development, interactive storytelling, and
                        continuously improving my skills in software development.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Home;
