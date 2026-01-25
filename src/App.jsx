import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Showcase from "./pages/Showcase";
import AudioMaker from "./components/AudioMaker";
import Popup from "./components/Popup";
import { ThemeProvider } from "./ThemeContext";

function App() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("welcome");

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");

        if (!hasVisited) {
            setPopupType("welcome");
            localStorage.setItem("hasVisited", "true");
        } else {
            setPopupType("return");
        }

        setShowPopup(true);
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
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/showcase" element={<Showcase />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
