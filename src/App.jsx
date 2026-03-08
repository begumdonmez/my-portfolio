import React from "react";
import Background from "./components/Background";
import Cards from "./components/Cards";

function App() {
    return (
        <div>
            <Background />

            {/* HERO */}
            <div
                style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "25vh",
                }}
            >
                <h1>Begum Donmez</h1>
                <p>Game Developer</p>
            </div>

            {/* CARDS */}
            <Cards />

            {/* ABOUT */}
            <section
                id="about"
                style={{
                    color: "white",
                    padding: "120px 20px",
                    textAlign: "center",
                }}
            >
                <h2>About</h2>
                <p>About me section</p>
            </section>

            {/* PROJECTS */}
            <section
                id="projects"
                style={{
                    color: "white",
                    padding: "120px 20px",
                    textAlign: "center",
                }}
            >
                <h2>Projects</h2>
                <p>My games and experiments</p>
            </section>

            {/* SKILLS */}
            <section
                id="skills"
                style={{
                    color: "white",
                    padding: "120px 20px",
                    textAlign: "center",
                }}
            >
                <h2>Skills</h2>
                <p>Tools and technologies I use</p>
            </section>

            {/* CONTACT */}
            <section
                id="contact"
                style={{
                    color: "white",
                    padding: "120px 20px",
                    textAlign: "center",
                }}
            >
                <h2>Contact</h2>
                <p>Get in touch</p>
            </section>
        </div>
    );
}

export default App;