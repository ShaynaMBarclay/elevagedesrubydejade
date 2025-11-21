import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/DogDetail.css";

export default function DogDetail() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState("2025");

  useEffect(() => {
    async function fetchDog() {
      try {
        const docRef = doc(db, "dogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Main image
          let mainImage = placeholder;
if (data.images && data.images.length > 0) {
  try {
    mainImage = await getDownloadURL(ref(storage, data.images[0])); // first uploaded image
  } catch {}
}

          // Parent images
          const fatherImg = data.parents?.father?.image
            ? await getDownloadURL(ref(storage, data.parents.father.image))
            : placeholder;
          const motherImg = data.parents?.mother?.image
            ? await getDownloadURL(ref(storage, data.parents.mother.image))
            : placeholder;

          setDog({
            id: docSnap.id,
            ...data,
            image: mainImage,
            parents: {
              father: {
                name: data.parents?.father?.name || "Inconnu",
                image: fatherImg,
              },
              mother: {
                name: data.parents?.mother?.name || "Inconnu",
                image: motherImg,
              },
            },
          });
        } else {
          setDog(null);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dog:", err);
        setLoading(false);
      }
    }

    fetchDog();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!dog) return <p>Chien non trouvé</p>;

  const years = ["2025", "2024", "2023", "2022"];
  const handleYearClick = (year) => setActiveYear(year);

  return (
    <main className="dog-detail-page">
      <Link to="/chiens">← Retour à nos chiens</Link>

      <h1>{dog.name}</h1>
      <p>{dog.sex} {dog.type} née le {dog.birth}</p>
     <img src={dog.image || placeholder} alt={dog.name} />


      {isAdmin && (
        <div className="admin-controls">
          <Link to={`/chiens/edit/${dog.id}`} className="edit-btn">Modifier</Link>
          <button className="delete-btn">Supprimer</button>
        </div>
      )}

      <div className="dog-category informations">
        <h2>Informations</h2>
        <p><strong>Sexe:</strong> {dog.sex}</p>
        <p><strong>Puce:</strong> {dog.microchip}</p>
        <p><strong>Inscrit au LOF ?</strong> {dog.lof}</p>
        <p><strong>N° origine:</strong> {dog.originNumber}</p>
        <p><strong>Cotation:</strong> {dog.rating}</p>
        <p><strong>ADN:</strong> {dog.dna}</p>
        <p><strong>Tares:</strong></p>
        <ul>
          <li>Dysplasie Coude (ED): {dog.health?.elbowDysplasia || "N/A"}</li>
          <li>Dysplasie Hanche (HD): {dog.health?.hipDysplasia || "N/A"}</li>
          <li>MD: {dog.health?.md || "N/A"}</li>
          <li>Mutation MDR1: {dog.health?.mdr1 || "N/A"}</li>
          <li>Nanisme hypophysaire (NAH): {dog.health?.nah || "N/A"}</li>
        </ul>
      </div>

      <div className="dog-category parents">
        <h2>Les parents</h2>
        <div>
          <p>Père: {dog.parents.father.name}</p>
          <img src={dog.parents.father.image || placeholder} alt={dog.parents.father.name} />
        </div>
        <div>
          <p>Mère: {dog.parents.mother.name}</p>
          <img src={dog.parents.mother.image || placeholder} alt={dog.parents.mother.name} />
        </div>
      </div>

      <button className="pedigree-btn">Voir le pédigree complet</button>

      <div className="dog-category palmares">
        <h2>Palmarès</h2>
        {dog.palmares?.length > 0 ? (
          <ul>{dog.palmares.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
        ) : <p>À venir</p>}
      </div>

      <div className="dog-category results">
        <h2>Résultats</h2>
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
          <p>Les résultats de {activeYear} apparaîtront ici.</p>
        </div>
      </div>
    </main>
  );
}
