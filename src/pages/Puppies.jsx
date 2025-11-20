import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Puppies.css";
import { useAdmin } from "../contexts/AdminContext";
import testPuppyImg from "../assets/tina.jpg";

export default function Puppies() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [puppies, setPuppies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("chiots");
  const [activeDogType, setActiveDogType] = useState("all");

  // Puppy categories
  const categories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

  // Dog types
  const dogTypes = [
    { id: "all", label: "Tous" },
    { id: "tcheque", label: "Chien-loup tchecoslovaque" },
    { id: "berger", label: "Berger Blanc Suisse" },
  ];

  // Static local puppies
  const localPuppies = [
    {
      id: "test-puppy",
      name: "Chiot Test",
      type: "berger",
      category: "chiots",
      image: testPuppyImg,
    },
    // Add more local puppies if needed
  ];

  // Fetch puppies from backend and merge with local ones
  useEffect(() => {
    async function fetchPuppies() {
      try {
        const res = await axios.get("http://localhost:4000/api/chiots");
        const backendPuppies = res.data.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          category: p.category,
          image: p.image?.url || testPuppyImg,
        }));
        // Merge local + backend without duplicates
        const merged = [...localPuppies];
        backendPuppies.forEach((bp) => {
          if (!merged.find((p) => p.id === bp.id)) merged.push(bp);
        });
        setPuppies(merged);
      } catch (err) {
        console.error("Failed to fetch puppies:", err);
        setPuppies(localPuppies); // fallback
      }
    }
    fetchPuppies();
  }, []);

  const filteredPuppies = puppies.filter(
    (puppy) =>
      (activeDogType === "all" || puppy.type === activeDogType) &&
      (activeCategory === "chiots" || puppy.category === activeCategory)
  );

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

      {/* Add puppy button for admin */}
      {isAdmin && (
        <div className="admin-actions">
          <button onClick={() => navigate("/admin/add-puppy")}>Ajouter un chiot</button>
        </div>
      )}

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

                {/* Admin edit/delete */}
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => navigate(`/admin/edit-puppy/${puppy.id}`)}>Modifier</button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Supprimer ce chiot ?")) {
                          try {
                            await axios.delete(`http://localhost:4000/api/chiots/${puppy.id}`);
                            setPuppies((prev) => prev.filter((p) => p.id !== puppy.id));
                          } catch (err) {
                            console.error("Failed to delete puppy:", err);
                          }
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
