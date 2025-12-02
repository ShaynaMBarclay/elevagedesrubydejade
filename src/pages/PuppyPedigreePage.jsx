import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import Pedigree from "../components/Pedigree";

export default function PuppyPedigreePage() {
  const { id } = useParams();
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
    async function fetchPuppy() {
      try {
        const snap = await getDoc(doc(db, "puppies", id));
        if (!snap.exists()) {
          setPuppy(null);
          setLoading(false);
          return;
        }

        const data = snap.data();

        const subjectImage = data.images?.[0] ? await fetchImage(data.images[0]) : placeholder;
        const father = data.parents?.father || {};
        const fatherImage = await fetchImage(father.image);
        const mother = data.parents?.mother || {};
        const motherImage = await fetchImage(mother.image);

        const paternalGF = father.grandfather || {};
        const paternalGFImage = await fetchImage(paternalGF.image);
        const paternalGM = father.grandmother || {};
        const paternalGMImage = await fetchImage(paternalGM.image);

        const maternalGF = mother.grandfather || {};
        const maternalGFImage = await fetchImage(maternalGF.image);
        const maternalGM = mother.grandmother || {};
        const maternalGMImage = await fetchImage(maternalGM.image);

        setPuppy({
          pedigree: {
            subject: { name: data.name, image: subjectImage },
            father: { name: father.name || "Inconnu", image: fatherImage },
            mother: { name: mother.name || "Inconnue", image: motherImage },
            paternalGF: { name: paternalGF.name || "Inconnu", image: paternalGFImage },
            paternalGM: { name: paternalGM.name || "Inconnue", image: paternalGMImage },
            maternalGF: { name: maternalGF.name || "Inconnu", image: maternalGFImage },
            maternalGM: { name: maternalGM.name || "Inconnue", image: maternalGMImage },
          },
        });

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du pédigree :", err);
        setLoading(false);
      }
    }

    fetchPuppy();
  }, [id]);

  if (loading) return <p>Chargement du pédigree...</p>;
  if (!puppy) return <p>Chiot introuvable.</p>;

  return (
    <div className="pedigree-page">
      <Link to={`/puppy/${id}`}>← Retour au chiot</Link>
      <h1>Pédigree de {puppy.pedigree.subject.name}</h1>
      <Pedigree dog={puppy} />
    </div>
  );
}
