import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-name">Élevage des Ruby de Jade</p>

        <p className="footer-contact">
          📞 +33 6 12 34 56 78 | ✉️{" "}
          <a href="mailto:contact@elevage-des-ruby-de-jade.fr">
            contact@elevage-des-ruby-de-jade.fr
          </a>
        </p>

        <p className="footer-copy">
          © {new Date().getFullYear()} Élevage des Ruby de Jade. Tous droits réservés.
        </p>

        <p className="footer-links">
          <Link to="/mentions-legales">Mentions légales</Link> |{" "}
          <a 
            href="https://www.chiens-de-france.com/legal/confidentialite" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Politique de confidentialité
          </a> |{" "}
          <a 
            href="https://www.chiots-de-france.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Chiots de France
          </a>
        </p>
      </div>
    </footer>
  );
}
