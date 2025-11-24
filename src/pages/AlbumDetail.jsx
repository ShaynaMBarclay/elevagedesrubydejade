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

  // Fetch album
  useEffect(() => {
    async function fetchAlbum() {
      try {
        const docRef = doc(db, "galleries", albumId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Resolve URLs
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

  // Handle file selection
  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  // Upload new media
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
      // Refresh album
      const docSnap = await getDoc(docRef);
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
    } catch (err) {
      console.error("Error uploading media:", err);
    }
  };

  // Delete media
  const handleDeleteMedia = async (item) => {
    if (!window.confirm(`Supprimer "${item.name}" ?`)) return;

    try {
      const docRef = doc(db, "galleries", albumId);
      const fileRef = ref(storage, item.url);
      await deleteObject(fileRef).catch(() => {});
      await updateDoc(docRef, {
        media: arrayRemove({ url: item.url, name: item.name, type: item.type }),
      });

      // Refresh album
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

  return (
    <main className="gallery-page">
      <h1>{album.name}</h1>
      {isAdmin && (
        <div className="admin-controls">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <button onClick={handleUpload} className="upload-btn">
            Ajouter médias
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {album.media.length === 0 && <p>Aucun média pour cet album.</p>}
        {album.media.map((m, i) => (
          <div key={i} className="gallery-item">
            {m.type === "image" ? (
              <img src={m.url || placeholder} alt={m.name} loading="lazy" />
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
    </main>
  );
}
