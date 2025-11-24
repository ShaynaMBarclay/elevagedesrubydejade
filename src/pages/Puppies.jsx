import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/Puppies.css";

export default function Puppies() {
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("chiots");
  const [activeDogType, setActiveDogType] = useState("all");

  const categories = [
    { id: "chiots", label: "Chiots" },
    { id: "disponibles", label: "Chiots disponibles" },
    { id: "futures", label: "Futures Portées" },
    { id: "nes", label: "Chiots nés chez nous" },
  ];

  const dogTypes = [
    { id: "all", label: "Tous" },
    { id: "tcheque", label: "Chien-loup tchecoslovaque" },
    { id: "berger", label: "Berger Blanc Suisse" },
  ];

  // Fetch puppies from Firebase
  useEffect(() => {
    async function fetchPuppies() {
      try {
        const querySnapshot = await getDocs(collection(db, "puppies"));
        const puppyData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Get first image for card
            let imageUrl = placeholder;
            if (data.images && data.images.length > 0) {
              try {
                imageUrl = await getDownloadURL(ref(storage, data.images[0]));
              } catch {}
            }

            return { id: doc.id, ...data, image: imageUrl };
          })
        );

        setPuppies(puppyData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching puppies:", err);
        setLoading(false);
      }
    }

    fetchPuppies();
  }, []);

  // Handle hash changes for categories
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

  const handleDogTypeClick = (id) => setActiveDogType(id);

  // Filter puppies based on category and breed
  const filteredPuppies = puppies.filter((puppy) => {
    const categoryLabel = categories.find((cat) => cat.id === activeCategory)?.label;

    // Only show puppy if its filters include the active category
    const categoryMatch = puppy.filters && puppy.filters.includes(categoryLabel);

    const typeMatch =
      activeDogType === "all"
        ? true
        : activeDogType === "tcheque"
        ? puppy.breed === "Chien-loup tchecoslovaque"
        : activeDogType === "berger"
        ? puppy.breed === "Berger Blanc Suisse"
        : false;

    return categoryMatch && typeMatch;
  });

  return (
    <main className="puppies-page">
      <h1 className="puppies-title">Nos Chiots</h1>
      <p className="intro">
        Découvrez nos chiots disponibles, les futures portées, et ceux nés chez nous.
      </p>

      {isAdmin && (
        <div className="admin-actions">
          <Link to="/chiots/add" className="add-dog-btn">
            Ajouter un chiot
          </Link>
        </div>
      )}

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

      <div className="puppies-content">
        {loading ? (
          <p>Chargement des chiots...</p>
        ) : filteredPuppies.length === 0 ? (
          <p>Aucun chiot disponible pour cette sélection.</p>
        ) : (
          <div className="dog-grid">
            {filteredPuppies.map((puppy) => (
              <div key={puppy.id} className="dog-card">
                <Link to={`/chiots/${puppy.id}`}>
                  <img src={puppy.image || placeholder} alt={puppy.name} />
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
