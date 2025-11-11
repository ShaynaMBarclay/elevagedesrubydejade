import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
          <Link to="/">Accueil</Link>
          <Link to="/about">Notre Histoire</Link>
          <Link to="/dogs">Nos Chiens</Link>
          <Link to="/contact">Contact</Link>
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
