import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-name">Élevage des Ruby de Jade</p>
        <p className="footer-contact">
          📞 +33 6 12 34 56 78 | ✉️ <a href="mailto:contact@elevage-des-ruby-de-jade.fr">contact@elevage-des-ruby-de-jade.fr</a>
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} Élevage des Ruby de Jade. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
