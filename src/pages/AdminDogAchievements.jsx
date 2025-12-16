import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing achievement data for the selected dog (but don't display in form)
  useEffect(() => {
    async function fetchAchievement() {
      try {
        const docRef = doc(db, "dogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // No need to set achievements to form - only read for validation
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAchievement();
  }, [id]);

  const handleNewImagesChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "dogs", id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.exists() ? docSnap.data() : {};

      // Upload new images
      const uploadedImagePaths = [];
      for (const img of newImages) {
        const imgRef = ref(storage, `dogs/${id}/achievements/${year}/${crypto.randomUUID()}`);
        await uploadBytes(imgRef, img);
        uploadedImagePaths.push(imgRef.fullPath);
      }

      // New achievement object
      const newAchievement = {
        id: crypto.randomUUID(),
        date,
        event,
        judge,
        palmares: palmares.split("\n").filter(Boolean),
        results: results.split("\n").filter(Boolean),
        images: uploadedImagePaths,
      };

      // Get the existing achievements and add the new one as a separate entry
      const existingAchievements = data.achievements?.[year] || [];
      await updateDoc(docRef, {
        [`achievements.${year}`]: [...existingAchievements, newAchievement],
      });

      alert("Palmarès & résultats enregistrés !");
      navigate(`/chiens/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’enregistrement");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="admin-achievements-page">
      <h1>Ajouter Palmarès & Résultats</h1>

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
        <textarea value={palmares} onChange={(e) => setPalmares(e.target.value)} />

        <label>📊 Résultats (1 par ligne)</label>
        <textarea value={results} onChange={(e) => setResults(e.target.value)} />

        <label>Images</label>
        <input type="file" multiple accept="image/*" onChange={handleNewImagesChange} />

        {/* New Images Thumbnails */}
        {newImages.length > 0 && (
          <div className="image-thumbnails">
            {newImages.map((file, index) => (
              <div key={index} className="thumbnail">
                <img src={URL.createObjectURL(file)} alt={`New ${index}`} />
                <button type="button" onClick={() => handleRemoveNewImage(index)}>×</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Enregistrer</button>
      </form>
    </main>
  );
}
