import { useState, useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { ThemeContext } from "../ThemeContext";

function Header() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            
            const scrollValue = window.scrollY;
            setRotation(scrollValue * 0.2); 
        };

        window.addEventListener("scroll", handleScroll);
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    return (
        <header className="header">
            {/* Sol taraf */}
            <Link to="/" className="header-left">
                <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="profile-img"
                    style={{ transform: `rotate(${rotation}deg)` }} 
                />
                <span className="name">Begüm Dönmez</span>
            </Link>
            
            <nav className="header-right">
                <Link to="/">Home</Link>
                <Link to="/aboutme">AboutMe</Link>
                <Link to="/showcase">My Showcase</Link>
                <Link to="/contact">Message Me</Link>

                {/* Tema Değiştirme Butonu */}
                <button onClick={toggleTheme} className="theme-toggle">
                    {isDarkMode ? "🌙" : "☀️"}
                </button>
                
            </nav>
        </header>
    );
}

export default Header;
