import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/DogDetail.css";

export default function DogDetail() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("informations");
  const [activeYear, setActiveYear] = useState("2025"); // for results filter

  const categories = [
    { id: "informations", label: "Informations" },
    { id: "parents", label: "Les parents" },
    { id: "palmares", label: "Palmarès" },
    { id: "resultats", label: "Résultats" },
  ];

  const years = ["2025", "2024", "2023", "2022"];

  const handleCategoryClick = (id) => setActiveCategory(id);
  const handleYearClick = (year) => setActiveYear(year);

  return (
    <main className="dog-detail-page">
      <Link to="/Chiens">← Retour à nos chiens</Link>

      {/* Category Tabs */}
      <div className="dog-detail-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`dog-detail-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="dog-detail-content">
        {activeCategory === "informations" && (
          <div className="informations">
            <p><strong>Sexe:</strong> {/* placeholder */}</p>
            <p><strong>Puce:</strong> {/* placeholder */}</p>
            <p><strong>Inscrit au LOF ?</strong> {/* placeholder */}</p>
            <p><strong>N° origine:</strong> {/* placeholder */}</p>
            <p><strong>Cotation:</strong> {/* placeholder */}</p>
            <p><strong>ADN:</strong> {/* placeholder */}</p>
            <p><strong>Tares:</strong> {/* placeholder */}</p>
          </div>
        )}

        {activeCategory === "parents" && (
          <div className="parents">
            <div>
              <p><strong>Père:</strong> {/* placeholder */}</p>
              <img src="#" alt="Père" /> {/* replace with father's image */}
            </div>
            <div>
              <p><strong>Mère:</strong> {/* placeholder */}</p>
              <img src="#" alt="Mère" /> {/* replace with mother's image */}
            </div>
            <button className="pedigree-btn">Voir le pédigree complet</button>
          </div>
        )}

        {activeCategory === "palmares" && (
          <div className="palmares">
            {/* Placeholder box for achievements */}
            <p>Palmarès details will be here</p>
          </div>
        )}

        {activeCategory === "resultats" && (
          <div className="resultats">
            <div className="years-filter">
              {years.map((year) => (
                <button
                  key={year}
                  className={`year-btn ${activeYear === year ? "active" : ""}`}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="results-list">
              <p>Les résultats for {activeYear} will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
