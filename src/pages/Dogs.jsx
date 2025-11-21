import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/Dogs.css";

export default function Dogs() {
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("chiens");
  const [activeDogType, setActiveDogType] = useState("all");

  const categories = [
    { id: "chiens", label: "Chiens" },
    { id: "males", label: "Mâles" },
    { id: "femelles", label: "Femelles" },
    { id: "resultats", label: "Résultats" },
    { id: "retraites", label: "Retraités" },
    { id: "memoire", label: "En mémoire" },
  ];

  const dogTypes = [
    { id: "all", label: "Tous" },
    { id: "tcheque", label: "Chien-loup tchecoslovaque" },
    { id: "berger", label: "Berger Blanc Suisse" },
  ];

  useEffect(() => {
    async function fetchDogs() {
      try {
        const querySnapshot = await getDocs(collection(db, "dogs"));
        const dogsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = placeholder;
            if (data.images && data.images.length > 0) {
              try {
                imageUrl = await getDownloadURL(ref(storage, data.images[0]));
              } catch {}
            }
            return {
              id: doc.id,
              ...data,
              image: imageUrl,
            };
          })
        );
        setDogs(dogsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dogs:", err);
        setLoading(false);
      }
    }

    fetchDogs();
  }, []);

  // Handle category from URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (categories.find((cat) => cat.id === hash)) setActiveCategory(hash);
  }, [location.hash]);

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    navigate(`#${id}`, { replace: true });
  };

  const handleDogTypeClick = (id) => setActiveDogType(id);

  // Filter dogs dynamically
  const filteredDogs = dogs.filter((dog) => {
    // Status categories
    if (activeCategory === "retraites") return dog.retraite;
    if (activeCategory === "memoire") return dog.memoire;

    // Regular categories
    const categoryMatch =
      activeCategory === "chiens"
        ? true
        : activeCategory === "males"
        ? dog.sex === "Mâle"
        : activeCategory === "femelles"
        ? dog.sex === "Femelle"
        : activeCategory === "resultats"
        ? dog.category === "resultats"
        : false;

    const typeMatch =
      activeDogType === "all"
        ? true
        : activeDogType === "tcheque"
        ? dog.breed === "Chien-loup tchecoslovaque"
        : activeDogType === "berger"
        ? dog.breed === "Berger Blanc Suisse"
        : false;

    return categoryMatch && typeMatch;
  });

  return (
    <main className="dogs-page">
      <h1>Nos Chiens</h1>
      <p className="intro">
        Découvrez nos reproducteurs, femelles, et compagnons — chaque chien fait partie de notre
        famille.
      </p>

      {isAdmin && (
        <div className="admin-add-dog">
          <Link to="/chiens/add" className="add-dog-btn">
            Ajouter un chien
          </Link>
        </div>
      )}

      {/* ---- Dog Type Filters ---- */}
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

      {/* ---- Categories Tabs ---- */}
      <div className="dog-categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`dog-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ---- Dog Grid ---- */}
      <div className="dog-content">
        {loading ? (
          <p>Loading dogs...</p>
        ) : filteredDogs.length === 0 ? (
          <p>Aucun chien disponible pour cette sélection.</p>
        ) : (
          <div className="dog-grid">
            {filteredDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <Link to={`/chiens/${dog.id}`}>
                  <img src={dog.image || placeholder} alt={dog.name} />
                  <p className="dog-name">{dog.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
