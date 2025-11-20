import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../styles/Navbar.css";
import { useAdmin } from "../contexts/AdminContext"; // Import admin context

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, logout } = useAdmin(); // Get admin state and logout function
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleLogout = () => {
    logout();           // Clear admin state
    navigate("/");      // Redirect to home page
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-logo-group">
          <Link to="/" className="nav-logo">Élevage des Ruby de Jade</Link>
          <span className="nav-subtitle">Chien-loup tchecoslovaque</span>
        </div>

        {/* Links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-home" onClick={() => setIsOpen(false)}><FaHome /></Link>
          <Link to="/chiens" onClick={() => setIsOpen(false)}>CHIENS</Link>
          <Link to="/chiots" onClick={() => setIsOpen(false)}>CHIOTS</Link>
          <Link to="/actualites" onClick={() => setIsOpen(false)}>ACTUALITÉS</Link>
          <Link to="/galeries" onClick={() => setIsOpen(false)}>GALERIES</Link>
          <Link to="/liens" onClick={() => setIsOpen(false)}>LIENS</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>CONTACT</Link>

          {/* Show logout if admin is logged in */}
          {isAdmin && (
            <button className="logout-button" onClick={handleLogout}>
              Déconnexion
            </button>
          )}
        </div>

        {/* Hamburger */}
        <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
