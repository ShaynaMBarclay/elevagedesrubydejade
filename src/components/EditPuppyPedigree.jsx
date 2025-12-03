import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAdmin } from "../contexts/AdminContext";
import "../styles/EditPedigree.css";

export default function EditPuppyPedigree() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [pedigree, setPedigree] = useState({
    subject: { name: "", image: "" },
    mother: { name: "", father: { name: "", image: "" }, mother: { name: "", image: "" }, image: "" },
    father: { name: "", father: { name: "", image: "" }, mother: { name: "", image: "" }, image: "" },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "puppies", id);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();

      // Prefill pedigree: existing pedigree > parent info > puppy info
      setPedigree({
        subject: {
          name: data.pedigree?.subject?.name || data.name || "",
          image: data.pedigree?.subject?.image || data.images?.[0] || "",
        },
        father: {
          name: data.pedigree?.father?.name || data.parents?.father?.name || "",
          image: data.pedigree?.father?.image || data.parents?.father?.image || "",
          father: {
            name: data.pedigree?.father?.father?.name || data.parents?.father?.grandfather?.name || "",
            image: data.pedigree?.father?.father?.image || data.parents?.father?.grandfather?.image || "",
          },
          mother: {
            name: data.pedigree?.father?.mother?.name || data.parents?.father?.grandmother?.name || "",
            image: data.pedigree?.father?.mother?.image || data.parents?.father?.grandmother?.image || "",
          },
        },
        mother: {
          name: data.pedigree?.mother?.name || data.parents?.mother?.name || "",
          image: data.pedigree?.mother?.image || data.parents?.mother?.image || "",
          father: {
            name: data.pedigree?.mother?.father?.name || data.parents?.mother?.grandfather?.name || "",
            image: data.pedigree?.mother?.father?.image || data.parents?.mother?.grandfather?.image || "",
          },
          mother: {
            name: data.pedigree?.mother?.mother?.name || data.parents?.mother?.grandmother?.name || "",
            image: data.pedigree?.mother?.mother?.image || data.parents?.mother?.grandmother?.image || "",
          },
        },
      });

      setLoading(false);
    }

    fetchData();
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

  async function handleImageUpload(e, path) {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `pedigrees/${id}/${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    update(path, url);
  }

  async function handleSave() {
    await updateDoc(doc(db, "puppies", id), { pedigree });
    alert("Pédigree mis à jour !");
    navigate(`/chiots/${id}/pedigree`);
  }

  return (
    <main className="edit-pedigree-page">
      <Link to={`/chiots/${id}/pedigree`} className="back-btn">← Retour</Link>
      <h1>Modifier le pédigree du chiot</h1>

      {/* Subject */}
      <div className="form-section">
        <h2>Chiot</h2>
        <input
          type="text"
          placeholder="Nom"
          value={pedigree.subject.name}
          onChange={(e) => update("subject.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "subject.image")} />
      </div>

      {/* Mother */}
      <div className="form-section">
        <h2>Mère</h2>
        <input
          type="text"
          placeholder="Nom de la mère"
          value={pedigree.mother.name}
          onChange={(e) => update("mother.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "mother.image")} />

        <h3>Grands-parents maternels</h3>
        <input
          type="text"
          placeholder="Père de la mère"
          value={pedigree.mother.father.name}
          onChange={(e) => update("mother.father.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "mother.father.image")} />

        <input
          type="text"
          placeholder="Mère de la mère"
          value={pedigree.mother.mother.name}
          onChange={(e) => update("mother.mother.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "mother.mother.image")} />
      </div>

      {/* Father */}
      <div className="form-section">
        <h2>Père</h2>
        <input
          type="text"
          placeholder="Nom du père"
          value={pedigree.father.name}
          onChange={(e) => update("father.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "father.image")} />

        <h3>Grands-parents paternels</h3>
        <input
          type="text"
          placeholder="Père du père"
          value={pedigree.father.father.name}
          onChange={(e) => update("father.father.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "father.father.image")} />

        <input
          type="text"
          placeholder="Mère du père"
          value={pedigree.father.mother.name}
          onChange={(e) => update("father.mother.name", e.target.value)}
        />
        <input type="file" onChange={(e) => handleImageUpload(e, "father.mother.image")} />
      </div>

      <button className="save-btn" onClick={handleSave}>
        Enregistrer le pédigree
      </button>
    </main>
  );
}
