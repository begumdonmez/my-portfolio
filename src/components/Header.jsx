import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    return (
        <header className="header">
            {/* Sol taraf */}
            <Link to="/" className="header-left">
                <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="profile-img"
                />
                <span className="name">Begüm Dönmez</span>
            </Link>

            {/* Sağ taraf */}
            <nav className="header-right">
                <Link to="/">Home</Link>
                <Link to="/showcase">My Showcase</Link>
                <Link to="/contact">Message Me</Link>
            </nav>
        </header>
    );
}

export default Header;
