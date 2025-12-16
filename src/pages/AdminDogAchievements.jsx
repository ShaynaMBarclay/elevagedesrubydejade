import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import "../styles/AdminDogAchievements.css";

export default function AdminDogAchievements() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [year, setYear] = useState("2026");
  const [date, setDate] = useState("");
  const [event, setEvent] = useState("");
  const [judge, setJudge] = useState("");
  const [palmares, setPalmares] = useState("");
  const [results, setResults] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload images to Firebase Storage
      const imagePaths = [];
      for (const img of images) {
        const imgRef = ref(storage, `dogs/${id}/achievements/${year}/${crypto.randomUUID()}`);
        await uploadBytes(imgRef, img);
        imagePaths.push(imgRef.fullPath);
      }

      // Merge with existing achievements
      const docRef = doc(db, "dogs", id);
      await updateDoc(docRef, {
        [`achievements.${year}`]: {
          date,
          event,
          judge,
          palmares: palmares.split("\n").filter(Boolean),
          results: results.split("\n").filter(Boolean),
          images: imagePaths,
        },
      });

      alert("Palmarès & résultats enregistrés !");
      navigate(`/chiens/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’enregistrement");
    }
  };

  return (
    <main className="admin-achievements-page">
      <h1>Ajouter / Modifier Palmarès & Résultats</h1>

      <form onSubmit={handleSubmit}>
        <label>Année</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option>2026</option>
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>

        <label>Date</label>
        <input
          type="text"
          placeholder="ex: 6/3/2022"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Événement</label>
        <input
          type="text"
          placeholder="ex: Vesoul Exposition Canine Nationale"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          required
        />

        <label>Juge</label>
        <input
          type="text"
          placeholder="ex: Petra MAROVA"
          value={judge}
          onChange={(e) => setJudge(e.target.value)}
          required
        />

        <label>🏆 Palmarès (1 par ligne)</label>
        <textarea
          value={palmares}
          onChange={(e) => setPalmares(e.target.value)}
        />

        <label>📊 Résultats (1 par ligne)</label>
        <textarea
          value={results}
          onChange={(e) => setResults(e.target.value)}
        />

        <label>Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        <button type="submit">Enregistrer</button>
      </form>
    </main>
  );
}
