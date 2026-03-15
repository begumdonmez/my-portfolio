import React from 'react';
import './SocialSidebar.css';
import githubIcon from '../assets/GitHub.png';
import itchioIcon from '../assets/Itchio.png';
import linkedinIcon from '../assets/Linkedin.png';
import cvButtonIcon from '../assets/cvdownload.png';
function SocialSidebar() {
    return (
        <div className="social-sidebar">
            <a href="https://github.com/begumdonmez" target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub" className="social-icon" />
            </a>
            <a href="https://begumdonmez.itch.io" target="_blank" rel="noopener noreferrer">
                <img src={itchioIcon} alt="Itch.io" className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/in/hatice-begüm-dönmez-84b723258/" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
            </a>
            <a
                href="/Begum_Donmez_CV.pdf"
                download="hatice_begum_donmezCV.pdf"
                className="cv-download-btn"
                title="Download CV"
            >
                <img src={cvButtonIcon} alt="Download CV" className="social-icon cv-icon" />
            </a>
        </div>
    );
}

export default SocialSidebar;