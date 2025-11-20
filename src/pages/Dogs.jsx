import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/Dogs.css";
import { useAdmin } from "../contexts/AdminContext"; // Admin context
import tinaImg from "../assets/tina.jpg"; 
import severkaImg from "../assets/severka.jpg"; 
import ubyImg from "../assets/uby.jpg";
import undyImg from "../assets/undy.jpg";

export default function Dogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin(); // Get admin state

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

  const allDogs = [
    { id: 1, name: "Tina De l'empreinte des Bergers", type: "berger", category: "femelles", image: tinaImg },
    { id: 2, name: "Severka iii od Úhoště", type: "tcheque", category: "femelles", image: severkaImg },
    { id: 3, name: "Uby Des Ruby De Jade", type: "tcheque", category: "femelles", image: ubyImg },
    { id: 4, name: "Undy Des Ruby De Jade", type: "tcheque", category: "femelles", image: undyImg },
  ];

  const filteredDogs = allDogs.filter(
    (dog) =>
      (activeDogType === "all" || dog.type === activeDogType) &&
      (activeCategory === "chiens" || dog.category === activeCategory)
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

  // Placeholder admin actions
  const handleAddDog = () => {
    navigate("/chiens/add"); // Redirect to a form page
  };
  const handleEditDog = (id) => {
    navigate(`/chiens/edit/${id}`);
  };
  const handleDeleteDog = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chien ?")) {
      console.log("Deleting dog:", id);
      // TODO: call backend API to delete
    }
  };

  return (
    <main className="dogs-page">
      <h1>Nos Chiens</h1>
      <p className="intro">
        Découvrez nos reproducteurs, femelles, et compagnons — chaque chien fait partie de notre famille.
      </p>

      {/* Admin Add Button */}
      {isAdmin && (
        <div className="admin-controls">
          <button onClick={handleAddDog} className="add-dog-button">
            Ajouter un chien
          </button>
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

      <div className="dog-content">
        {filteredDogs.length === 0 ? (
          <p>Aucun chien disponible pour cette sélection.</p>
        ) : (
          <div className="dog-grid">
            {filteredDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <Link to={`/chiens/${dog.id}`}>
                  <img src={dog.image} alt={dog.name} />
                  <p className="dog-name">{dog.name}</p>
                </Link>

                {/* Admin Edit/Delete Buttons */}
                {isAdmin && (
                  <div className="admin-dog-actions">
                    <button onClick={() => handleEditDog(dog.id)} className="edit-button">
                      Éditer
                    </button>
                    <button onClick={() => handleDeleteDog(dog.id)} className="delete-button">
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
