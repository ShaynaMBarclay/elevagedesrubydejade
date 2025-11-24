import { useState } from "react";
import "../styles/Gallery.css";
import lazyImg from "../assets/lazy.jpg";
import expo1Image from "../assets/expo1.jpg";
import expo2Image from "../assets/expo2.jpg";

export default function Gallery() {
  const [filter, setFilter] = useState("photos"); 
  const [photoSection, setPhotoSection] = useState("expo"); 

  const enExpo = [
    { id: 1, src: expo1Image, alt: "Expo photo 1" },
    { id: 2, src: expo2Image, alt: "Expo photo 2" },
  ];

  const enFamille = [
    { id: 3, src: lazyImg, alt: "Chien en famille" },
  ];

  return (
    <main className="gallery-page">
      <h1>Galerie</h1>

      {/* === FILTER BAR === */}
      <div className="filter-bar">
        <div
          className={`filter-pill ${filter === "photos" ? "active" : ""}`}
          onClick={() => setFilter("photos")}
        >
          Photos
        </div>
        <div
          className={`filter-pill ${filter === "videos" ? "active" : ""}`}
          onClick={() => setFilter("videos")}
        >
          Vidéos
        </div>
      </div>

      {filter === "photos" && (
        <>
          {/* Sub-filter for photos */}
          <div className="photo-subfilters">
            <div
              className={`sub-pill ${photoSection === "expo" ? "active" : ""}`}
              onClick={() => setPhotoSection("expo")}
            >
              En Expo
            </div>
            <div
              className={`sub-pill ${photoSection === "famille" ? "active" : ""}`}
              onClick={() => setPhotoSection("famille")}
            >
              En Famille
            </div>
          </div>

          {/* Gallery Section */}
          <div className="gallery-grid">
            {(photoSection === "expo" ? enExpo : enFamille).map((img) => (
              <div key={img.id} className="gallery-item">
                {img.src ? (
                  <img src={img.src} alt={img.alt}  loading="lazy" />
                ) : (
                  <div className="placeholder">Image à venir</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {filter === "videos" && (
        <div className="no-videos">Aucune vidéo disponible pour le moment 🎥</div>
      )}
    </main>
  );
}
