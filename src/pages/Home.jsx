import "./Home.css";
import WhatAmIDoing from "../components/WhatAmIDoing";


function Home() {
    return (
        <div className="home">
            <div className="home-content">

                <section className="home-section">
                    <h1>Who am I?</h1>
                    <p>
                        I'm Begüm. I'm a 4th-year Digital Game Design student.
                        I didn't want to create a boring CV, so I built this website
                        to reflect who I am and what I enjoy creating.
                    </p>
                </section>

                <WhatAmIDoing/>

            </div>
        </div>
    );
}

export default Home;
