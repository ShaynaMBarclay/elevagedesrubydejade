import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import Pedigree from "../components/Pedigree";
import { useAdmin } from "../contexts/AdminContext";

export default function PedigreePage({ collection = "dogs" }) {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [dog, setDog] = useState(null);
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
    const docRef = doc(db, collection, id);

    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (!snap.exists()) {
        setDog(null);
        setLoading(false);
        return;
      }

      const data = snap.data();

      // Fallbacks if pedigree is empty
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

      setDog({
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
  }, [id, collection]);

  if (loading) return <p>Chargement du pédigree...</p>;
  if (!dog) return <p>Chien introuvable.</p>;

  return (
    <div className="pedigree-page">
      <h1>Pédigree de {dog.pedigree.subject.name}</h1>

      {isAdmin && (
        <button
          className="edit-pedigree-btn"
          onClick={() =>
            navigate(
              `/${collection === "dogs" ? "chiens" : "chiots"}/${id}/pedigree/edit`
            )
          }
        >
          Modifier le pédigree
        </button>
      )}

      <Pedigree dog={dog} />
       <Link
       to={`/${collection === "dogs" ? "chiens" : "chiots"}/${id}`}
       className="return-link"
       >
       ← Retour au {collection === "dogs" ? "chien" : "chiot"}
      </Link>
    </div>
  );
}
