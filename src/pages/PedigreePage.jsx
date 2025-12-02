import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import Pedigree from "../components/Pedigree";

export default function PedigreePage() {
  const { id } = useParams();
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
    async function fetchDog() {
      try {
        const snap = await getDoc(doc(db, "dogs", id));

        if (!snap.exists()) {
          setDog(null);
          setLoading(false);
          return;
        }

        const data = snap.data();

        // SUBJECT
        const subjectImage = data.images && data.images.length > 0
  ? await fetchImage(data.images[0])
  : placeholder;

        // FATHER
        const father = data.parents?.father || {};
        const fatherImage = await fetchImage(father.image);

        // MOTHER
        const mother = data.parents?.mother || {};
        const motherImage = await fetchImage(mother.image);

        // GRANDPARENTS
        const paternalGF = father.grandfather || {};
        const paternalGFImage = await fetchImage(paternalGF.image);

        const paternalGM = father.grandmother || {};
        const paternalGMImage = await fetchImage(paternalGM.image);

        const maternalGF = mother.grandfather || {};
        const maternalGFImage = await fetchImage(maternalGF.image);

        const maternalGM = mother.grandmother || {};
        const maternalGMImage = await fetchImage(maternalGM.image);

        setDog({
          pedigree: {
            subject: { name: data.name, image: subjectImage },
            father: { name: father.name || "Inconnu", image: fatherImage },
            mother: { name: mother.name || "Inconnue", image: motherImage },

            paternalGF: {
              name: paternalGF.name || "Inconnu",
              image: paternalGFImage,
            },
            paternalGM: {
              name: paternalGM.name || "Inconnue",
              image: paternalGMImage,
            },

            maternalGF: {
              name: maternalGF.name || "Inconnu",
              image: maternalGFImage,
            },
            maternalGM: {
              name: maternalGM.name || "Inconnue",
              image: maternalGMImage,
            },
          },
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading pedigree:", err);
        setLoading(false);
      }
    }

    fetchDog();
  }, [id]);

  if (loading) return <p>Chargement du pédigree...</p>;
  if (!dog) return <p>Chien introuvable.</p>;

  return <Pedigree dog={dog} />;
}
