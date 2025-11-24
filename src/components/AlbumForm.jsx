import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../styles/AlbumForm.css";

export default function AlbumForm({ albumId, isEdit = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    media: [], // { type: "image"|"video", url: string, name: string }
  });

  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (isEdit && albumId) {
      const fetchAlbum = async () => {
        const docRef = doc(db, "galleries", albumId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setFormData(snapshot.data());
        }
      };
      fetchAlbum();
    }
  }, [isEdit, albumId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = (e) => setNewFiles([...newFiles, ...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let docRef;
      if (isEdit && albumId) {
        docRef = doc(db, "galleries", albumId);
        await updateDoc(docRef, formData);
      } else {
        docRef = await addDoc(collection(db, "galleries"), formData);
      }

      const finalId = docRef.id || albumId;
      const uploadedMedia = [...formData.media];

      for (let file of newFiles) {
        const fileType = file.type.startsWith("image") ? "image" : "video";
        const fileRef = ref(
          storage,
          `galleries/${finalId}/${Date.now()}-${file.name}`
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploadedMedia.push({ type: fileType, url, name: file.name });
      }

      await updateDoc(doc(db, "galleries", finalId), { media: uploadedMedia });

      navigate("/galeries");
    } catch (err) {
      console.error("Erreur création/édition album:", err);
    }
  };

  return (
    <main className="album-form-page">
      <h1>{isEdit ? "Éditer" : "Créer"} un album</h1>
      <form className="album-form" onSubmit={handleSubmit}>
        <label>Nom de l'album</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Ajouter des fichiers</label>
        <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} />

        <div className="preview-grid">
          {formData.media.map((m, i) => (
            <div key={i} className="preview-item">
              {m.type === "image" ? (
                <img src={m.url} alt={m.name} loading="lazy" />
              ) : (
                <video src={m.url} controls preload="metadata" />
              )}
            </div>
          ))}
          {newFiles.map((f, i) => {
            const url = URL.createObjectURL(f);
            const type = f.type.startsWith("image") ? "image" : "video";
            return (
              <div key={"new" + i} className="preview-item">
                {type === "image" ? (
                  <img src={url} alt={f.name} loading="lazy" />
                ) : (
                  <video src={url} controls preload="metadata" />
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className="save-btn">
          {isEdit ? "Mettre à jour" : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}
