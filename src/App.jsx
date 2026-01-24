import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Showcase from "./pages/Showcase";
import AudioMaker from "./components/AudioMaker";
import { ThemeProvider } from "./ThemeContext"; // Context'ini import ettik

function App() {
    return (
        <BrowserRouter>
            {/* ThemeProvider, Router'ın içinde olmalı ki içindeki bileşenler hem Router'a hem Temaya erişebilsin */}
            <ThemeProvider>
                <Header />
                <AudioMaker />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/showcase" element={<Showcase />} />
                </Routes>

                {/* AudioMaker'ı da buraya (Header gibi global bir yere) ekleyebilirsin */}
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;