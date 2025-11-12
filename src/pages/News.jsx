import { useState } from "react";
import "../styles/News.css";
import updateImg from "../assets/updateimg.jpg"; 

export default function News() {
  const [activeCategory, setActiveCategory] = useState("2025");

  const categories = [
    { id: "2025", label: "2025" },
    { id: "2024", label: "2024" },
  ];

  return (
    <main className="news-page">
      <h1>Actualités</h1>
      <p className="intro">
        Découvrez nos actualités, portées et événements récents de l’Élevage des Ruby de Jade.
      </p>

      {/* Category Tabs */}
      <div className="news-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`news-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="news-content">
        {activeCategory === "2025" && (
          <div className="update-section">
            <h2>Portée 2025</h2>
            <div className="update-content">
              <div className="update-text">
                <p>🐾 Les chiots de Ruby & Roberto arrivent cet automne ! 🐾</p>
                <p>
                  Nous sommes heureux d’annoncer la prochaine portée à l’Élevage des Ruby de Jade.
                </p>
                <p>
                  Une union exceptionnelle entre Ruby (Severka III Oduhoste) et Roberto (Robert Plant Sing Immigrant Song Athanor Lupus) — deux lignées soigneusement sélectionnées pour leur tempérament équilibré, leur santé irréprochable et leur beauté naturelle.
                </p>
                <p>🐾 Ce qu’il faut savoir :</p>
                <ul>
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
              </div>
              <div className="update-image">
                <img src={updateImg} alt="Portée 2025 Ruby & Roberto" />
              </div>
            </div>
          </div>
        )}

        {activeCategory === "2024" && (
          <div className="news-2024">
            <p>
              Découvrez nos actualités et événements de l’année 2024.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
