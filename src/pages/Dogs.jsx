import { useState } from "react";
import "../styles/Dogs.css";

export default function Dogs() {
  const [activeCategory, setActiveCategory] = useState("chiens");

  const categories = [
    { id: "chiens", label: "Chiens" },
    { id: "males", label: "Mâles" },
    { id: "femelles", label: "Femelles" },
    { id: "resultats", label: "Résultats" },
    { id: "retraites", label: "Retraités" },
    { id: "memoire", label: "En mémoire" },
  ];

  return (
    <main className="dogs-page">
      <h1>Nos Chiens</h1>
      <p className="intro">
        Découvrez nos reproducteurs, femelles, et anciens compagnons — chaque
        chien fait partie de notre grande famille.
      </p>

      {/* Category Tabs */}
      <div className="dog-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`dog-tab ${
              activeCategory === cat.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="dog-content">
        {activeCategory === "chiens" && (
          <p>Sélectionnez une catégorie pour voir nos chiens.</p>
        )}
        {activeCategory === "males" && (
          <p>Voici nos magnifiques mâles reproducteurs.</p>
        )}
        {activeCategory === "femelles" && (
          <p>Nos femelles élevées avec amour et attention.</p>
        )}
        {activeCategory === "resultats" && (
          <p>Découvrez les résultats et distinctions obtenus par nos chiens.</p>
        )}
        {activeCategory === "retraites" && (
          <p>Nos chiens à la retraite profitent de la vie paisible à la ferme.</p>
        )}
        {activeCategory === "memoire" && (
          <p>En mémoire de nos compagnons disparus, à jamais dans nos cœurs.</p>
        )}
      </div>
    </main>
  );
}
