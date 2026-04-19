import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 50px'den fazla kaydırıldığında header görünsün
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`dynamic-header ${scrolled ? 'visible' : 'hidden'}`}>
            <div className="header-logo">BEGÜM</div>
            <nav className="header-nav">
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#skills">Skills</a>
                <a href="#contact">Contact</a>
            </nav>
        </header>
    );
};

export default Header;