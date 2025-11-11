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
          <Link to="/" className="nav-home">
          <FaHome size={20} />
          </Link>
          <Link to="/dogs">CHIENS</Link>
          <Link to="/puppies">CHIOTS</Link>
          <Link to="/news">ACTUALITÉS</Link>
          <Link to="/Gallery">GALERIES</Link>
          <Link to="/Liens">LIENS</Link>
          <Link to="/contact">CONTACT</Link>
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
