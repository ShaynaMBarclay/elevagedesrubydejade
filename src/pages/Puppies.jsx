import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/Puppies.css";
import testPuppyImg from "../assets/tina.jpg";

export default function Puppies() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("chiots");
  const [activeDogType, setActiveDogType] = useState("all");

  // Puppy categories (similar to Dogs categories)
  const categories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

  // Dog type filters (same as Dogs page)
  const dogTypes = [
    { id: "all", label: "Tous" },
    { id: "tcheque", label: "Chien-loup tchecoslovaque" },
    { id: "berger", label: "Berger Blanc Suisse" },
  ];

  // Example puppy data
  const allPuppies = [
    {
      id: "test-puppy",
      name: "Chiot Test",
      type: "berger",
      category: "chiots",
      image: testPuppyImg,
    },
    // Add more puppies here...
  ];

  const filteredPuppies = allPuppies.filter(
    (puppy) =>
      (activeDogType === "all" || puppy.type === activeDogType) &&
      (activeCategory === "chiots" || puppy.category === activeCategory)
  );

  // Sync category with URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (categories.find((cat) => cat.id === hash)) setActiveCategory(hash);
  }, [location.hash]);

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    navigate(`#${id}`, { replace: true });
  };

  const handleDogTypeClick = (id) => setActiveDogType(id);

  return (
    <main className="puppies-page">
      <h1 className="puppies-title">Nos Chiots</h1>
      <p className="intro">
        Découvrez nos chiots disponibles, les futures portées, et ceux nés chez nous. Chaque chiot est élevé avec soin et amour.
      </p>

      {/* Dog type filters */}
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

      {/* Category tabs */}
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

      {/* Category content */}
      <div className="puppies-content">
        {filteredPuppies.length === 0 ? (
          <p>Aucun chiot disponible pour cette sélection.</p>
        ) : (
          <div className="dog-grid">
            {filteredPuppies.map((puppy) => (
              <div key={puppy.id} className="dog-card">
                <Link to={`/Chiots/${puppy.id}`}>
                  <img src={puppy.image} alt={puppy.name} />
                  <p className="dog-name">{puppy.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
