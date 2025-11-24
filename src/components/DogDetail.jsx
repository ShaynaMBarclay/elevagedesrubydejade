import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/DogDetail.css";

export default function DogDetail() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
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

          // Fetch all uploaded dog images
          let allImages = [];
          if (data.images && data.images.length > 0) {
            allImages = await Promise.all(
              data.images.map(async (imgPath) => {
                try {
                  return await getDownloadURL(ref(storage, imgPath));
                } catch {
                  return placeholder;
                }
              })
            );
          }

          // First image as main
          const mainImage = allImages[0] || placeholder;

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
            allImages, // store all images for detail page
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

  const handleDeleteDog = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${dog.name} ?`)) return;

    try {
      const storageRefs = [];

      // Dog images
      if (dog.images && dog.images.length > 0) {
        dog.images.forEach((imgUrl) => storageRefs.push(ref(storage, imgUrl)));
      }

      // Parent images
      if (dog.parents?.father?.image) storageRefs.push(ref(storage, dog.parents.father.image));
      if (dog.parents?.mother?.image) storageRefs.push(ref(storage, dog.parents.mother.image));

      // Delete all images
      await Promise.all(storageRefs.map((imgRef) => deleteObject(imgRef).catch(() => {})));

      // Delete Firestore document
      await deleteDoc(doc(db, "dogs", dog.id));

      alert(`${dog.name} a été supprimé avec succès.`);
      navigate("/chiens");
    } catch (err) {
      console.error("Erreur lors de la suppression du chien:", err);
      alert("Impossible de supprimer le chien. Voir la console pour plus de détails.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!dog) return <p>Chien non trouvé</p>;

  const years = ["2025", "2024", "2023", "2022"];
  const handleYearClick = (year) => setActiveYear(year);

  return (
    <main className="dog-detail-page">
      <Link to="/chiens">← Retour à nos chiens</Link>

      <h1>{dog.name}</h1>
      <p>{dog.sex} {dog.type} née le {dog.birth}</p>

      {/* Display all uploaded images */}
      <div className="dog-images">
        {dog.allImages && dog.allImages.length > 0 ? (
          dog.allImages.map((img, idx) => (
            <img key={idx} src={img || placeholder} alt={`${dog.name} ${idx + 1}`} />
          ))
        ) : (
          <img src={placeholder} alt={dog.name} loading="lazy" />
        )}
      </div>

      {isAdmin && (
  <div className="admin-controls">
    <button
      className="edit-btn"
      onClick={() => navigate(`/chiens/edit/${dog.id}`)}
    >
      Modifier
    </button>
    <button onClick={handleDeleteDog} className="delete-btn">
      Supprimer
    </button>
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
          <img src={dog.parents.father.image || placeholder} alt={dog.parents.father.name}  loading="lazy" />
        </div>
        <div>
          <p>Mère: {dog.parents.mother.name}</p>
          <img src={dog.parents.mother.image || placeholder} alt={dog.parents.mother.name}  loading="lazy" />
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
