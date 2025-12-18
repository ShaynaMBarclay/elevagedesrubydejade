import { Link } from "react-router-dom";
//import Gallery from "../pages/Gallery";
import "../styles/Home.css";
import homeImg from "../assets/homeimg.jpg"; 
import updateImg from "../assets/updateimg.jpg";
import logoImg from "../assets/logo.jpeg";

export default function Home() {
  const dogCategories = [
    { id: "chiens", label: "Chiens" },
    { id: "males", label: "Mâles" },
    { id: "femelles", label: "Femelles" },
    { id: "retraites", label: "Retraités" },
    { id: "memoire", label: "En mémoire" },
  ];

  const puppyCategories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

  return (
    <main className="home-page">
      {/* === About Section === */}
      <section className="about-preview">
        <div className="about-content">
          <div className="about-text">
            <h2>Des Ruby de Jade - Chien Loup Tchécoslovaque & Berger Blanc Suisse</h2>
            <p>
              Fort d'une expérience de 15 ans dans l'élevage de chien loup, j'ai le plaisir de vous partager ma passion pour cette race. Au plaisir de vous recevoir à la ferme découvrir nos chiens, qui grandissent et s'épanouissent avec d'autres races de chiens, moutons, chèvres, poules, lapins. 
            </p>
            <p>
              La race nécessitant un travail important de socialisation, nous assurons suivi et partage de notre passion avec vous.
            </p>
            <p>Sophie KNOPF</p>
          </div>
          <div className="about-image">
              <img
              src={homeImg}
              alt="Élevage des Ruby de Jade"
              loading="lazy"
              className="about-main-img"
             />

               <img
               src={logoImg}
               alt="Logo Élevage des Ruby de Jade"
               loading="lazy"
               className="about-logo"
              />
             </div>
             </div>
      </section>

        {/* === Update Section === */}
      <section className="update-preview">
        <div className="update-content">
          <div className="update-text">
            <h2>Portée 2025</h2>
            <p>🐾 Les chiots de Ruby & Roberto arrivent cet automne ! 🐾</p>
            <p>
              Nous sommes heureux d’annoncer la prochaine portée à l’Élevage des Ruby de Jade.
            </p>
            <p>
              Une union exceptionnelle entre Ruby (Severka III Oduhoste) et Roberto (Robert Plant Sing Immigrant Song Athanor Lupus) — deux lignées soigneusement sélectionnées pour leur tempérament équilibré, leur santé irréprochable et leur beauté naturelle.
            </p>
            <p>🐾 Ce qu’il faut savoir :</p>
            <ul className="update-list">
              <li>0% de consanguinité sur 5 générations</li>
              <li>Tests complets : MD / MDR1 / pelage</li>
              <li>Hanches et coudes contrôlés</li>
              <li>CSAU et TAN validés (Roberto)</li>
            </ul>
            <p>
              Nos chiots grandiront dans un environnement familial, socialisés dès leurs premières semaines et habitués à différents stimuli pour rejoindre vos foyers sereinement.
            </p>
            <p>🐾 Chiots attendus cet automne – les réservations sont ouvertes !</p>
            <p>📞 Infos & réservations : Sophie – 06 50 87 91 80</p>
            <p>✉️ schneider.sof68@hotmail.fr</p>
            <div className="update-header">
           <Link to="/actualites" className="news-button">
             Actualités
           </Link>
         </div>
          </div>
          <div className="update-image">
            <img src={updateImg} alt="Portée 2025 Ruby & Roberto"  loading="lazy" />
          </div>
        </div>
      </section>

      {/* === Dogs Section with Categories === */}
      <section className="dogs-preview">
        <h2>Nos Chiens</h2>
        <p>
          Découvrez nos reproducteurs et nos femelles, sélectionnés pour leur
          caractère équilibré et leur beauté conforme au standard de la race.
        </p>

        {/* Dog Category Tabs */}
        <div className="dog-categories-home">
          {dogCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/chiens#${cat.id}`}
              className="dog-tab-home"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/*<Gallery />*/}
      </section>

      {/* === Puppies Section with Categories === */}
      <section className="puppies-preview">
        <h2>Nos Chiots</h2>
        <p>
          Nos chiots grandissent dans un environnement familial, entourés
          d’attention et de soins. Ils sont prêts à rejoindre leur future
          famille dans les meilleures conditions possibles.
        </p>

        {/* Puppies Category Tabs */}
        <div className="puppies-categories-home">
          {puppyCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/chiots#${cat.id}`}
              className="puppies-tab-home"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* === Contact Preview === */}
      <section className="contact-preview">
        <h2>Nous Contacter</h2>
        <p>
          Pour toute question ou pour en savoir plus sur nos chiots disponibles,
          n’hésitez pas à{" "}
          <a href="/contact" className="contact-link">
            nous contacter
          </a>.
        </p>
      </section>
    </main>
  );
}
