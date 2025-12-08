import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navbar.css";
import { useAdmin } from "../contexts/AdminContext";

import purinaLogo from "../assets/purinalogo.avif";
import facebookLogo from "../assets/smallfblogo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Home Icon on Left */}
        <Link to="/" className="nav-home">
          <FaHome />
        </Link>

        {/* Logo/Name Centered */}
        <div className="nav-logo-group">
          <Link to="/" className="nav-logo">Élevage des Ruby de Jade</Link>
          <span className="nav-subtitle">
            Chien-loup tchecoslovaque & <br />Berger Blanc Suisse
          </span>
        </div>

        {/* Hamburger on Right */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Dropdown Menu */}
        <div className={`nav-dropdown ${menuOpen ? "open" : ""}`}>
          <Link to="/chiens" onClick={() => setMenuOpen(false)}>CHIENS</Link>
          <Link to="/chiots" onClick={() => setMenuOpen(false)}>CHIOTS</Link>
          <Link to="/actualites" onClick={() => setMenuOpen(false)}>ACTUALITÉS</Link>
          <Link to="/galeries" onClick={() => setMenuOpen(false)}>GALERIES</Link>
          <Link to="/liens" onClick={() => setMenuOpen(false)}>LIENS</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link>

          {/* Secondary icons/links */}
          <div className="dropdown-icons">
            <a href="https://www.purina.fr" target="_blank" rel="noopener noreferrer">
              <img className="purina-logo" src={purinaLogo} alt="Purina" />
            </a>
            <a href="https://www.facebook.com/DesRubyDeJade/" target="_blank" rel="noopener noreferrer">
              <img className="facebook-logo" src={facebookLogo} alt="Facebook" />
            </a>
            <a className="cdf-link" href="https://www.chiens-de-france.com/" target="_blank" rel="noopener noreferrer">
              Chiens-de-France
            </a>
          </div>

          {isAdmin && (
            <button className="logout-button" onClick={handleLogout}>
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
