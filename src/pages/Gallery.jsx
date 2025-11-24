import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
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
          <div className="admin-banner">Mode Admin Activé</div>
        </div>
      )}

      {loading ? (
        <p>Chargement des albums...</p>
      ) : galleries.length === 0 ? (
        <p>Aucun album disponible.</p>
      ) : (
        <div className="album-grid">
          {galleries.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => navigate(`/gallery/${album.id}`)}
            >
              <img
                src={album.previewImage}
                alt={album.name}
                className="album-preview"
              />
              <p className="album-name">{album.name}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
