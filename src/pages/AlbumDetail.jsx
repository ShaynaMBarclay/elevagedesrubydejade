import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAdmin } from "../contexts/AdminContext";
import "../styles/Gallery.css";
import placeholder from "../assets/placeholder.png";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newFiles, setNewFiles] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const [lightboxImage, setLightboxImage] = useState(null); 

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const docRef = doc(db, "galleries", albumId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const mediaWithUrls = await Promise.all(
            (data.media || []).map(async (m) => {
              let url = m.url;
              try {
                if (!url.startsWith("http")) {
                  url = await getDownloadURL(ref(storage, m.url));
                }
              } catch {}
              return { ...m, url };
            })
          );

          setAlbum({ id: docSnap.id, ...data, media: mediaWithUrls });
        } else {
          console.error("Album not found");
          navigate("/galeries");
        }
      } catch (err) {
        console.error("Error fetching album:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbum();
  }, [albumId, navigate]);

  const handleFileChange = (e) => setNewFiles(Array.from(e.target.files));

  const handleUpload = async () => {
    if (!newFiles.length) return;

    try {
      const docRef = doc(db, "galleries", albumId);

      for (let file of newFiles) {
        const fileRef = ref(storage, `galleries/${albumId}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const type = file.type.startsWith("image") ? "image" : "video";
        await updateDoc(docRef, {
          media: arrayUnion({ url: fileRef.fullPath, name: file.name, type }),
        });
      }

      setNewFiles([]);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const mediaWithUrls = await Promise.all(
        (data.media || []).map(async (m) => {
          let url = m.url;
          try {
            if (!url.startsWith("http")) url = await getDownloadURL(ref(storage, m.url));
          } catch {}
          return { ...m, url };
        })
      );
      setAlbum({ id: docSnap.id, ...data, media: mediaWithUrls });
    } catch (err) {
      console.error("Error uploading media:", err);
    }
  };

  const handleDeleteMedia = async (item) => {
    if (!window.confirm(`Supprimer "${item.name}" ?`)) return;

    try {
      const docRef = doc(db, "galleries", albumId);
      const fileRef = ref(storage, item.url);
      await deleteObject(fileRef).catch(() => {});
      await updateDoc(docRef, {
        media: arrayRemove({ url: item.url, name: item.name, type: item.type }),
      });

      setAlbum((prev) => ({
        ...prev,
        media: prev.media.filter((m) => m.url !== item.url),
      }));
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  if (loading) return <p>Chargement de l'album...</p>;
  if (!album) return <p>Album non trouvé.</p>;

  const filteredMedia = album.media.filter((m) => {
    if (filter === "all") return true;
    if (filter === "images") return m.type === "image";
    if (filter === "videos") return m.type === "video";
    return true;
  });

  return (
    <main className="gallery-page">
      <h1>{album.name}</h1>

      {isAdmin && (
        <div className="admin-controls">
           <span style={{ marginLeft: "0.5rem", fontStyle: "italic", color: "#555" }}>
      (Choisir des fichiers)
    </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="file-input"
          />
          
          <button onClick={handleUpload} className="upload-btn" style={{ marginTop: "0.5rem" }}>
            Ajouter médias
          </button>
        </div>
      )}

      {/* Filter buttons */}
      <div className="photo-subfilters">
        <button
          className={`sub-pill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tous
        </button>
        <button
          className={`sub-pill ${filter === "images" ? "active" : ""}`}
          onClick={() => setFilter("images")}
        >
          Photos
        </button>
        <button
          className={`sub-pill ${filter === "videos" ? "active" : ""}`}
          onClick={() => setFilter("videos")}
        >
          Vidéos
        </button>
      </div>

      <div className="gallery-grid">
        {filteredMedia.length === 0 && <p>Aucun média pour cette catégorie.</p>}
        {filteredMedia.map((m, i) => (
          <div key={i} className="gallery-item">
            {m.type === "image" ? (
              <img
                src={m.url || placeholder}
                alt={m.name}
                loading="lazy"
                onClick={() => setLightboxImage(m.url)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <video src={m.url} controls preload="metadata" />
            )}
            {isAdmin && (
              <button
                onClick={() => handleDeleteMedia(m)}
                className="delete-media-btn"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
          <img src={lightboxImage} alt="Full View" className="lightbox-img" />
        </div>
      )}
    </main>
  );
}
