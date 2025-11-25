import "../styles/Links.css";
import purinaLogo from "../assets/purinalogo.avif"

export default function Links() {
  return (
    <main className="links-page">
      <h1>Liens Utiles</h1>
      <p className="intro">
        Retrouvez ici une sélection de liens utiles concernant l’élevage,
        les associations, les clubs et nos partenaires.
      </p>

      {/* Top Featured Links */}
      <div className="featured-links">
        {/* Purina Logo Link */}
        <a
          href="https://www.purina.fr/"
          target="_blank"
          className="purina-link"
        >
          <img src={purinaLogo} alt="Purina"  loading="lazy" />
        </a>

        {/* Facebook Button */}
        <a
          href="https://www.facebook.com/DesRubyDeJade/"
          target="_blank"
          className="facebook-button"
        >
          <i className="fab fa-facebook-f"></i> Suivez-nous sur Facebook
        </a>
      </div>

      <section className="links-section">
        <h2>Associations & Partenaire</h2>
        <ul>
          <li>
            <a href="https://barf-asso.fr/" target="_blank">
              Barf-Asso
            </a>
            </li>
            <li>
             <a href="https://www.facebook.com/profile.php?id=100092117111315" target="_blank">
              Inspirat'Yon 
            </a>
          </li>
        </ul>
      </section>

      <section className="links-section">
        <h2>Clubs</h2>
        <ul>
          <li>
            <a href="https://www.cbei.fr/" target="_blank">
              Club de race CBEI
            </a>
          </li>

          <li>
            <a
              href="http://www.chien-loup-tchecoslovaque.com/"
              target="_blank"
            >
              Club de Race du Chien Loup Tchécoslovaque
            </a>
          </li>
        </ul>
      </section>

      <section className="links-section">
        <h2>Divers</h2>
        <ul>
          <li>
            <a
              href="https://www.centrale-canine.fr/des-ruby-de-jade"
              target="_blank"
            >
              Page de l'élevage SCC
            </a>
          </li>
        </ul>
      </section>

      <section className="links-section">
        <h2>Éleveurs</h2>
        <ul>
          <li>
            <a href="https://www.athanorlupus.it/" target="_blank">
              Éleveur ami — Athanor Lupus
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
