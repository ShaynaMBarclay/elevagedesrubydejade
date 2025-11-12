import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Puppies.css";

export default function Puppies() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("chiots");

  const categories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

   // Set active category based on URL hash
    useEffect(() => {
      const hash = location.hash.replace("#", "");
      if (categories.find((cat) => cat.id === hash)) {
        setActiveCategory(hash);
      }
    }, [location.hash]);
  
    // Handle clicking a tab
    const handleCategoryClick = (id) => {
      setActiveCategory(id);
      navigate(`#${id}`, { replace: true }); 
    };
  

  return (
    <main className="puppies-page">
      <h1 className="puppies-title">Nos Chiots</h1>
      <p className="intro">
        Découvrez nos chiots disponibles, les futures portées, et ceux nés chez
        nous. Chaque chiot est élevé avec soin et amour.
      </p>

      {/* Category Tabs */}
      <div className="puppies-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`puppies-tab ${
              activeCategory === cat.id ? "active" : ""}`}
             onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="puppies-content">
        {activeCategory === "chiots" && (
          <p>Sélectionnez une catégorie pour découvrir nos chiots.</p>
        )}
        {activeCategory === "disponibles" && (
          <p>Voici nos chiots actuellement disponibles à l’adoption.</p>
        )}
        {activeCategory === "futures" && (
          <p>
            Consultez nos futures portées à venir — restez à l’écoute pour les
            annonces.
          </p>
        )}
        {activeCategory === "nes" && (
          <p>Découvrez les chiots nés chez nous, issus de nos lignées d’exception.</p>
        )}
      </div>
    </main>
  );
}
