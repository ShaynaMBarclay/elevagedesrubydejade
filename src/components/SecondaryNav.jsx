import { useState, useEffect } from "react";
import "../styles/SecondaryNav.css";

import purinaLogo from "../assets/purinalogo.avif";
import facebookLogo from "../assets/smallfblogo.png";

export default function SecondaryNav() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`secondary-nav ${hidden ? "hidden" : ""}`}>
  <ul className="icon-links">
    <div className="center-logos">
      {/* Purina */}
      <li>
        <a href="https://www.purina.fr" target="_blank" rel="noopener noreferrer">
          <img className="purina-logo" src={purinaLogo} alt="Purina" />
        </a>
      </li>

      {/* Facebook */}
      <li>
        <a href="https://www.facebook.com/DesRubyDeJade/" target="_blank" rel="noopener noreferrer">
           <img className="facebook-logo" src={facebookLogo} alt="Facebook" />
        </a>
      </li>
    </div>

    {/* Chiens de France */}
    <li className="right-link">
      <a
        className="cdf-link"
        href="https://www.chiens-de-france.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Chiens-de-France
      </a>
    </li>
  </ul>
</nav>
  );
}
