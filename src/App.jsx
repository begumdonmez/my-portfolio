import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Contact from "./pages/Contact";
import Showcase from "./pages/Showcase";

import AudioMaker from "./components/AudioMaker";
import Popup from "./components/Popup";
import { ThemeProvider } from "./ThemeContext";

function App() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        const navigationType =
            performance.getEntriesByType("navigation")[0]?.type;

        if (!hasVisited) {
            // 🔰 İlk ziyaret
            setPopupType("welcome");
            localStorage.setItem("hasVisited", "true");
            setShowPopup(true);
        }
        else if (navigationType === "reload") {
            // 🔁 Sayfa yenilendi
            setPopupType("resume");
            setShowPopup(true);
        }
        else {
            // 👋 Yeni tab / adres çubuğu / link
            setPopupType("welcomeBack");
            setShowPopup(true);
        }
    }, []);


    return (
        <BrowserRouter>
            <ThemeProvider>
                <Header />
                <AudioMaker />

                {showPopup && (
                    <Popup
                        type={popupType}
                        onClose={() => setShowPopup(false)}
                    />
                )}

                <Routes>

                    <Route path="/" element={<Home />} />
                    <Route path="/aboutme" element={<AboutMe />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/showcase" element={<Showcase />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
