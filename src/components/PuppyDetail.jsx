import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/PuppyDetail.css";

export default function PuppyDetail() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [puppy, setPuppy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPuppy() {
      try {
        const docRef = doc(db, "puppies", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setPuppy(null);
          setLoading(false);
          return;
        }
        const data = docSnap.data();

        // Fetch all images
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

        // Parent images
        const fatherImg = data.parents?.father?.image
          ? await getDownloadURL(ref(storage, data.parents.father.image))
          : placeholder;
        const motherImg = data.parents?.mother?.image
          ? await getDownloadURL(ref(storage, data.parents.mother.image))
          : placeholder;

        setPuppy({
          id: docSnap.id,
          ...data,
          allImages,
          parents: {
            father: { name: data.parents?.father?.name || "Inconnu", image: fatherImg },
            mother: { name: data.parents?.mother?.name || "Inconnu", image: motherImg },
          },
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching puppy:", err);
        setLoading(false);
      }
    }

    fetchPuppy();
  }, [id]);

  const handleDeletePuppy = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${puppy.name} ?`)) return;

    try {
      const storageRefs = [];

      if (puppy.images && puppy.images.length > 0) {
        puppy.images.forEach((imgPath) => storageRefs.push(ref(storage, imgPath)));
      }
      if (puppy.parents?.father?.image) storageRefs.push(ref(storage, puppy.parents.father.image));
      if (puppy.parents?.mother?.image) storageRefs.push(ref(storage, puppy.parents.mother.image));

      await Promise.all(storageRefs.map((imgRef) => deleteObject(imgRef).catch(() => {})));
      await deleteDoc(doc(db, "puppies", puppy.id));

      alert(`${puppy.name} a été supprimé avec succès.`);
      navigate("/chiots");
    } catch (err) {
      console.error("Erreur lors de la suppression du chiot:", err);
      alert("Impossible de supprimer le chiot. Voir la console pour plus de détails.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!puppy) return <p>Chiot non trouvé</p>;

  return (
    <main className="puppy-detail-page">
      <Link to="/chiots">← Retour à nos chiots</Link>
      <h1>{puppy.name}</h1>
      <p>{puppy.sex} {puppy.type} née le {puppy.birth}</p>

      <div className="dog-images">
        {puppy.allImages.length > 0 ? (
          puppy.allImages.map((img, idx) => <img key={idx} src={img} alt={`${puppy.name} ${idx + 1}`} />)
        ) : (
          <img src={placeholder} alt={puppy.name}  loading="lazy" />
        )}
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <button onClick={() => navigate(`/chiots/edit/${puppy.id}`)}>Modifier</button>
          <button onClick={handleDeletePuppy}>Supprimer</button>
        </div>
      )}

      {/* Informations */}
      <div className="puppy-category informations">
        <h2>Informations</h2>
        <p><strong>Sexe:</strong> {puppy.sex}</p>
        <p><strong>Puce:</strong> {puppy.microchip}</p>
        <p><strong>Inscrit au LOF ?</strong> {puppy.lof}</p>
        <p><strong>N° origine:</strong> {puppy.originNumber}</p>
        <p><strong>Cotation:</strong> {puppy.rating}</p>
        <p><strong>ADN:</strong> {puppy.dna}</p>
        <p><strong>Tares:</strong></p>
        <ul>
          <li>Dysplasie Coude (ED): {puppy.health?.elbowDysplasia || "N/A"}</li>
          <li>Dysplasie Hanche (HD): {puppy.health?.hipDysplasia || "N/A"}</li>
          <li>MD: {puppy.health?.md || "N/A"}</li>
          <li>Mutation MDR1: {puppy.health?.mdr1 || "N/A"}</li>
          <li>Nanisme hypophysaire (NAH): {puppy.health?.nah || "N/A"}</li>
        </ul>
      </div>

      {/* Parents */}
      <div className="puppy-category parents">
        <h2>Les parents</h2>
        <div>
          <p>Père: {puppy.parents.father.name}</p>
          <img src={puppy.parents.father.image} alt={puppy.parents.father.name}  loading="lazy" />
        </div>
        <div>
          <p>Mère: {puppy.parents.mother.name}</p>
          <img src={puppy.parents.mother.image} alt={puppy.parents.mother.name}   loading="lazy"/>
        </div>
      </div>

      <button className="pedigree-btn">Voir le pédigree complet</button>

      <div className="puppy-category palmares">
        <h2>Palmarès</h2>
        {puppy.palmares?.length > 0 ? (
          <ul>{puppy.palmares.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
        ) : (
          <p>À venir</p>
        )}
      </div>

      <div className="puppy-category results">
        <h2>Résultats</h2>
        <div className="years-filter">
          {["2025", "2024", "2023", "2022"].map((year) => (
            <button key={year} className="year-btn">{year}</button>
          ))}
        </div>
        <div className="results-list">
          <p>Les résultats de l'année sélectionnée apparaîtront ici.</p>
        </div>
      </div>
    </main>
  );
}
