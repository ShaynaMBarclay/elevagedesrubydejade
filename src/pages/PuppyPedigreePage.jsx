import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import Pedigree from "../components/Pedigree";
import { useAdmin } from "../contexts/AdminContext";

export default function PuppyPedigreePage() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [puppy, setPuppy] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchImage(path) {
    if (!path) return placeholder;
    try {
      return await getDownloadURL(ref(storage, path));
    } catch {
      return placeholder;
    }
  }

  useEffect(() => {
    const docRef = doc(db, "puppies", id);

    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (!snap.exists()) {
        setPuppy(null);
        setLoading(false);
        return;
      }

      const data = snap.data();
      const p = data.pedigree || {};

      const subjectImage = p.subject?.image || data.images?.[0] || placeholder;
      const subjectName = p.subject?.name || data.name || "Inconnu";

      const fatherName = p.father?.name || data.parents?.father?.name || "Inconnu";
      const fatherImage = p.father?.image || data.parents?.father?.image || placeholder;
      const motherName = p.mother?.name || data.parents?.mother?.name || "Inconnue";
      const motherImage = p.mother?.image || data.parents?.mother?.image || placeholder;

      const paternalGFName = p.father?.father?.name || data.parents?.father?.grandfather?.name || "Inconnu";
      const paternalGFImage = p.father?.father?.image || data.parents?.father?.grandfather?.image || placeholder;
      const paternalGMName = p.father?.mother?.name || data.parents?.father?.grandmother?.name || "Inconnu";
      const paternalGMImage = p.father?.mother?.image || data.parents?.father?.grandmother?.image || placeholder;

      const maternalGFName = p.mother?.father?.name || data.parents?.mother?.grandfather?.name || "Inconnu";
      const maternalGFImage = p.mother?.father?.image || data.parents?.mother?.grandfather?.image || placeholder;
      const maternalGMName = p.mother?.mother?.name || data.parents?.mother?.grandmother?.name || "Inconnu";
      const maternalGMImage = p.mother?.mother?.image || data.parents?.mother?.grandmother?.image || placeholder;

      setPuppy({
        pedigree: {
          subject: { name: subjectName, image: subjectImage },
          father: { name: fatherName, image: fatherImage },
          mother: { name: motherName, image: motherImage },
          paternalGF: { name: paternalGFName, image: paternalGFImage },
          paternalGM: { name: paternalGMName, image: paternalGMImage },
          maternalGF: { name: maternalGFName, image: maternalGFImage },
          maternalGM: { name: maternalGMName, image: maternalGMImage },
        },
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) return <p>Chargement du pédigree...</p>;
  if (!puppy) return <p>Chiot introuvable.</p>;

  return (
    <div className="pedigree-page">
      <Link to={`/chiots/${id}`}>← Retour au chiot</Link>
      <h1>Pédigree de {puppy.pedigree.subject.name}</h1>

      {isAdmin && (
        <button
          className="edit-pedigree-btn"
          onClick={() => navigate(`/chiots/${id}/pedigree/edit`)}
        >
          Modifier le pédigree
        </button>
      )}

      <Pedigree dog={puppy} />
    </div>
  );
}
