import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAdmin } from "../contexts/AdminContext";
import "../styles/EditPedigree.css";

export default function EditPedigree() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [pedigree, setPedigree] = useState({
    father: { name: "", father: { name: "" }, mother: { name: "" } },
    mother: { name: "", father: { name: "" }, mother: { name: "" } },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDog() {
      const docRef = doc(db, "dogs", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setPedigree(
          snap.data().pedigree || {
            father: { name: "", father: { name: "" }, mother: { name: "" } },
            mother: { name: "", father: { name: "" }, mother: { name: "" } },
          }
        );
      }

      setLoading(false);
    }

    fetchDog();
  }, [id]);

  if (!isAdmin) return <p>Accès non autorisé.</p>;
  if (loading) return <p>Loading...</p>;

  function update(path, value) {
    setPedigree((prev) => {
      const clone = structuredClone(prev);
      let obj = clone;
      const keys = path.split(".");
      while (keys.length > 1) obj = obj[keys.shift()];
      obj[keys[0]] = value;
      return clone;
    });
  }

  async function handleSave() {
    await updateDoc(doc(db, "dogs", id), { pedigree });
    alert("Pédigree mis à jour !");
   navigate(`/chiens/${id}`);

  }

  return (
    <main className="edit-pedigree-page">
      <Link to={`/chiens/${id}/pedigree`} className="back-btn">← Retour</Link>
      <h1>Modifier le pédigree</h1>

      <div className="form-section">
        <h2>Père</h2>
        <input
          type="text"
          placeholder="Nom du père"
          value={pedigree.father.name}
          onChange={(e) => update("father.name", e.target.value)}
        />

        <h3>Grands-parents paternels</h3>
        <input
          type="text"
          placeholder="Père du père"
          value={pedigree.father.father.name}
          onChange={(e) => update("father.father.name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Mère du père"
          value={pedigree.father.mother.name}
          onChange={(e) => update("father.mother.name", e.target.value)}
        />
      </div>

      <div className="form-section">
        <h2>Mère</h2>
        <input
          type="text"
          placeholder="Nom de la mère"
          value={pedigree.mother.name}
          onChange={(e) => update("mother.name", e.target.value)}
        />

        <h3>Grands-parents maternels</h3>
        <input
          type="text"
          placeholder="Père de la mère"
          value={pedigree.mother.father.name}
          onChange={(e) => update("mother.father.name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Mère de la mère"
          value={pedigree.mother.mother.name}
          onChange={(e) => update("mother.mother.name", e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Enregistrer le pédigree
      </button>
    </main>
  );
}
