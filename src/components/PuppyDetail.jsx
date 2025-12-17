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
  const [lightboxImage, setLightboxImage] = useState(null);

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

        // Puppy main images
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
      } catch (err) {
        console.error("Error fetching puppy:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPuppy();
  }, [id]);

  const handleDeletePuppy = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${puppy.name} ?`)) return;

    try {
      const storageRefs = [];
      if (puppy.images && puppy.images.length > 0) puppy.images.forEach(img => storageRefs.push(ref(storage, img)));
      if (puppy.parents?.father?.image) storageRefs.push(ref(storage, puppy.parents.father.image));
      if (puppy.parents?.mother?.image) storageRefs.push(ref(storage, puppy.parents.mother.image));

      await Promise.all(storageRefs.map(r => deleteObject(r).catch(() => {})));
      await deleteDoc(doc(db, "puppies", puppy.id));

      alert(`${puppy.name} a été supprimé avec succès.`);
      navigate("/chiots");
    } catch (err) {
      console.error(err);
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

      {/* Puppy images */}
      <div className="dog-images">
        {puppy.allImages.length > 0
          ? puppy.allImages.map((img, idx) => (
              <img
                key={idx}
                src={img || placeholder}
                alt={`${puppy.name} ${idx + 1}`}
                onClick={() => setLightboxImage(img)}
                style={{ cursor: "pointer" }}
              />
            ))
          : <img src={placeholder} alt={puppy.name} onClick={() => setLightboxImage(placeholder)} />}
      </div>

      {/* Parents */}
      <div className="puppy-category parents">
        <h2>Les parents</h2>
        <div>
          <p>Père: {puppy.parents.father.name}</p>
          <img
            src={puppy.parents.father.image}
            alt={puppy.parents.father.name}
            onClick={() => setLightboxImage(puppy.parents.father.image)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div>
          <p>Mère: {puppy.parents.mother.name}</p>
          <img
            src={puppy.parents.mother.image}
            alt={puppy.parents.mother.name}
            onClick={() => setLightboxImage(puppy.parents.mother.image)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="admin-controls">
          <button onClick={() => navigate(`/chiots/edit/${puppy.id}`)}>Modifier</button>
          <button onClick={handleDeletePuppy}>Supprimer</button>
        </div>
      )}

      {/* Information */}
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

      {/* Pedigree */}
      <Link to={`/chiots/${puppy.id}/pedigree`} className="pedigree-btn">
       Voir l'arbre généalogique
      </Link>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
          <img src={lightboxImage} alt="Full View" className="lightbox-img" />
        </div>
      )}
    </main>
  );
}
