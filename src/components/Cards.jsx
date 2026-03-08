import aboutCard from "../assets/AboutMe.png"
import projectsCard from "../assets/Projects.png"
import skillsCard from "../assets/Skills.png"
import contactCard from "../assets/ContactMe.png"

function Cards() {
    const cards = [
        { title: "About", image: aboutCard, link: "#about" },
        { title: "Projects", image: projectsCard, link: "#projects" },
        { title: "Skills", image: skillsCard, link: "#skills" },
        { title: "Contact", image: contactCard, link: "#contact" }
    ]

    return (
        <div className="cards-container">
            {cards.map((card, index) => (
                <a key={index} href={card.link} className="card">
                    <img src={card.image} alt={card.title} />
                </a>
            ))}
        </div>
    )
}

export default Cards