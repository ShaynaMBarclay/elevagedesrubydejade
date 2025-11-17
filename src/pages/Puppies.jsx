import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Puppies.css";

export default function Puppies() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("chiots");
  const [activeDogType, setActiveDogType] = useState("all");

  // Dog type filters (same as Dogs page)
  const dogTypes = [
    { id: "all", label: "Tous" },
    { id: "tcheque", label: "Chien-loup tchecoslovaque" },
    { id: "berger", label: "Berger Blanc Suisse" },
  ];

  // Main puppy categories
  const categories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

  // Sync category with URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (categories.find((cat) => cat.id === hash)) {
      setActiveCategory(hash);
    }
  }, [location.hash]);

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    navigate(`#${id}`, { replace: true });
  };

  const handleDogTypeClick = (id) => {
    setActiveDogType(id);
  };

  return (
    <main className="puppies-page">
      <h1 className="puppies-title">Nos Chiots</h1>
      <p className="intro">
        Découvrez nos chiots disponibles, les futures portées, et ceux nés chez
        nous. Chaque chiot est élevé avec soin et amour.
      </p>

      {/* DOG TYPE FILTERS */}
      <div className="dog-type-filters">
        {dogTypes.map((type) => (
          <button
            key={type.id}
            className={`dog-type-pill ${activeDogType === type.id ? "active" : ""}`}
            onClick={() => handleDogTypeClick(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="puppies-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`puppies-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="puppies-content">
        <p>
          <strong>Type de chien :</strong>{" "}
          {dogTypes.find((d) => d.id === activeDogType).label}
        </p>

        {activeCategory === "chiots" && <p>Sélectionnez une catégorie pour découvrir nos chiots.</p>}
        {activeCategory === "disponibles" && <p>Voici nos chiots actuellement disponibles à l’adoption.</p>}
        {activeCategory === "futures" && <p>Consultez nos futures portées à venir — restez à l’écoute pour les annonces.</p>}
        {activeCategory === "nes" && <p>Découvrez les chiots nés chez nous, issus de nos lignées d’exception.</p>}
      </div>
    </main>
  );
}
