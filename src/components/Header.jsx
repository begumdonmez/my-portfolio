import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = () => setMenuOpen(false);

    return (
        <header className={`dynamic-header ${scrolled ? 'visible' : 'hidden'}`}>
            <div className="header-logo">BEGÜM</div>

            <button
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span /><span /><span />
            </button>

            <nav className={`header-nav ${menuOpen ? 'nav-open' : ''}`}>
                <a href="#about" onClick={handleNavClick}>About</a>
                <a href="#projects" onClick={handleNavClick}>Projects</a>
                <a href="#skills" onClick={handleNavClick}>Skills</a>
                <a href="#contact" onClick={handleNavClick}>Contact</a>
            </nav>
        </header>
    );
};

export default Header;