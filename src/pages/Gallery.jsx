import { useState } from "react";
import "../styles/Gallery.css";

export default function Gallery() {
  const [images, setImages] = useState([
    // Placeholder images for now
    { id: 1, src: "", alt: "Image 1" },
    { id: 2, src: "", alt: "Image 2" },
    { id: 3, src: "", alt: "Image 3" },
  ]);

  return (
    <main className="gallery-page">
      <h1>Galerie</h1>
      <p className="intro">
        Bienvenue dans notre galerie ! Les photos seront ajoutées bientôt 📸
      </p>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            {image.src ? (
              <img src={image.src} alt={image.alt} />
            ) : (
              <div className="placeholder">Image à venir</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
