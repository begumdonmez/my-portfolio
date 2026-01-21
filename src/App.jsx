import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/showcase" element={<div>Showcase</div>} />
                <Route path="/contact" element={<div>Contact</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;