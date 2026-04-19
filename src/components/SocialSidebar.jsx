import React from 'react';
import './SocialSidebar.css';
import githubIcon from '../assets/GitHub.png';
import itchioIcon from '../assets/Itchio.png';
import linkedinIcon from '../assets/Linkedin.png';
import cvButtonIcon from '../assets/cvdownload.png';

function SocialSidebar() {
    return (
        <div className="social-sidebar">
            <a href="https://github.com/begumdonmez" target="_blank" rel="noopener noreferrer" data-label="github.com/begumdonmez">
                <img src={githubIcon} alt="GitHub" className="social-icon" />
            </a>
            <a href="https://begumdonmez.itch.io" target="_blank" rel="noopener noreferrer" data-label="itch.io/begumdonmez">
                <img src={itchioIcon} alt="Itch.io" className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/in/hatice-begüm-dönmez-84b723258/" target="_blank" rel="noopener noreferrer" data-label="linkedin/begumdonmez">
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
            </a>
            <a
                href="/hatice_begum_donmezCV.pdf"
                download="hatice_begum_donmezCV.pdf"
                className="cv-download-btn"
                data-label="PROTOCOL: DOWNLOAD_CV"
            >
                <img src={cvButtonIcon} alt="Download CV" className="social-icon cv-icon" />
            </a>
            <div className="sidebar-line"></div>
        </div>
    );
}

export default SocialSidebar;