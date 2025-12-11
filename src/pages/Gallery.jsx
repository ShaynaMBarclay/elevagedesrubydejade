import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { useAdmin } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import "../styles/Gallery.css";
import placeholder from "../assets/placeholder.png";

export default function Gallery() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch galleries from Firestore
  useEffect(() => {
    async function fetchGalleries() {
      try {
        const snapshot = await getDocs(collection(db, "galleries"));
        const galleryData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const mediaArray = data.media || [];

            // Get preview image (first media)
            let previewImage = placeholder;
            if (mediaArray.length > 0) {
              try {
                const firstImage = mediaArray.find((m) => m.type === "image");
                if (firstImage) {
                  previewImage = await getDownloadURL(ref(storage, firstImage.url));
                }
              } catch {}
            }

            return { id: docSnap.id, ...data, previewImage };
          })
        );

        setGalleries(galleryData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching galleries:", err);
        setLoading(false);
      }
    }

    fetchGalleries();
  }, []);

  // Delete an entire album
  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Supprimer l'album "${album.name}" ?`)) return;

    try {
      // Delete all media in storage
      if (album.media) {
        for (const m of album.media) {
          const fileRef = ref(storage, m.url);
          await deleteObject(fileRef).catch(() => {});
        }
      }

      // Delete the Firestore document
      await deleteDoc(doc(db, "galleries", album.id));

      setGalleries((prev) => prev.filter((g) => g.id !== album.id));
    } catch (err) {
      console.error("Error deleting album:", err);
    }
  };

  return (
    <main className="gallery-page">
      <h1>Galerie</h1>

      {isAdmin && (
        <div className="admin-controls">
          <button
            onClick={() => navigate("/gallery/add")}
            className="add-album-btn"
          >
            Créer un nouvel album
          </button>
        </div>
      )}

      {loading ? (
        <p>Chargement des albums...</p>
      ) : galleries.length === 0 ? (
         <p className="no-videos">Aucun album disponible.</p>
      ) : (
        <div className="album-grid">
          {galleries.map((album) => (
            <div key={album.id} className="album-card">
              <div
                onClick={() => navigate(`/gallery/${album.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={album.previewImage}
                  alt={album.name}
                  className="album-preview"
                />
                <p className="album-name">{album.name}</p>
              </div>

              {isAdmin && (
                <button
                  className="delete-album-btn"
                  onClick={() => handleDeleteAlbum(album)}
                >
                  Supprimer l'album
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
