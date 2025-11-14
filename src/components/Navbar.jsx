import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-logo-group">
          <Link to="/" className="nav-logo">
            Élevage des Ruby de Jade
          </Link>
          <span className="nav-subtitle">Chien-loup tchecoslovaque</span>
        </div>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-home" onClick={handleLinkClick}>
            <FaHome size={20} />
          </Link>
          <Link to="/chiens" onClick={handleLinkClick}>CHIENS</Link>
          <Link to="/chiots" onClick={handleLinkClick}>CHIOTS</Link>
          <Link to="/actualites" onClick={handleLinkClick}>ACTUALITÉS</Link>
          <Link to="/galeries" onClick={handleLinkClick}>GALERIES</Link>
          <Link to="/liens" onClick={handleLinkClick}>LIENS</Link>
          <Link to="/contact" onClick={handleLinkClick}>CONTACT</Link>
        </div>

        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
