import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/DogDetail.css";

export default function DogDetail() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState("2026");
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function fetchDog() {
      try {
        const docRef = doc(db, "dogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Dog main images
          let allImages = [];
          if (data.images && data.images.length > 0) {
            allImages = await Promise.all(
              data.images.map(async (imgPath) => {
                try {
                  return await getDownloadURL(ref(storage, imgPath));
                } catch {
                  return placeholder;
                }
              })
            );
          }

          // Achievement images
          if (data.achievements) {
            for (const year in data.achievements) {
              const yearData = data.achievements[year];
              if (yearData.images && yearData.images.length > 0) {
                yearData.imageURLs = await Promise.all(
                  yearData.images.map(async (imgPath) => {
                    try {
                      return await getDownloadURL(ref(storage, imgPath));
                    } catch {
                      return placeholder;
                    }
                  })
                );
              } else {
                yearData.imageURLs = [];
              }
            }
          }

          const fatherImg = data.parents?.father?.image
            ? await getDownloadURL(ref(storage, data.parents.father.image))
            : placeholder;

          const motherImg = data.parents?.mother?.image
            ? await getDownloadURL(ref(storage, data.parents.mother.image))
            : placeholder;

          setDog({
            id: docSnap.id,
            ...data,
            allImages,
            parents: {
              father: { name: data.parents?.father?.name || "Inconnu", image: fatherImg },
              mother: { name: data.parents?.mother?.name || "Inconnu", image: motherImg },
            },
          });
        } else {
          setDog(null);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dog:", err);
        setLoading(false);
      }
    }

    fetchDog();
  }, [id]);

  const handleDeleteDog = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${dog.name} ?`)) return;

    try {
      const storageRefs = [];
      if (dog.images && dog.images.length > 0) {
        dog.images.forEach((img) => storageRefs.push(ref(storage, img)));
      }
      if (dog.parents?.father?.image) storageRefs.push(ref(storage, dog.parents.father.image));
      if (dog.parents?.mother?.image) storageRefs.push(ref(storage, dog.parents.mother.image));

      await Promise.all(storageRefs.map((imgRef) => deleteObject(imgRef).catch(() => {})));
      await deleteDoc(doc(db, "dogs", dog.id));

      alert(`${dog.name} a été supprimé avec succès.`);
      navigate("/chiens");
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le chien.");
    }
  };

  const handleDeleteAchievement = async () => {
    if (!window.confirm("Supprimer cette réalisation pour cette année ?")) return;

    try {
      const yearData = dog.achievements[activeYear];

      if (yearData.images && yearData.images.length > 0) {
        const refs = yearData.images.map((imgPath) => ref(storage, imgPath));
        await Promise.all(refs.map((r) => deleteObject(r).catch(() => {})));
      }

      const docRef = doc(db, "dogs", dog.id);
      await updateDoc(docRef, {
        [`achievements.${activeYear}`]: {}
      });

      alert("Réalisation supprimée !");
      navigate(0);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression de la réalisation");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!dog) return <p>Chien non trouvé</p>;

  const years = ["2026", "2025", "2024", "2023", "2022"];
  const currentYearData = dog.achievements?.[activeYear];

  return (
    <main className="dog-detail-page">
      <Link to="/chiens">← Retour à nos chiens</Link>
      <h1>{dog.name}</h1>
      <p>{dog.sex} {dog.type} née le {dog.birth}</p>

      {/* Dog main images */}
      <div className="dog-images">
        {dog.allImages.length > 0
          ? dog.allImages.map((img, idx) => (
              <img
                key={idx}
                src={img || placeholder}
                alt={`${dog.name} ${idx + 1}`}
                onClick={() => setLightboxImage(img)}
                style={{ cursor: "pointer" }}
              />
            ))
          : <img src={placeholder} alt={dog.name} onClick={() => setLightboxImage(placeholder)} />}
      </div>

      {/* Parents */}
      <div className="dog-category parents">
        <h2>Les parents</h2>
        <div>
          <p>Père: {dog.parents.father.name}</p>
          <img
            src={dog.parents.father.image}
            alt={dog.parents.father.name}
            onClick={() => setLightboxImage(dog.parents.father.image)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div>
          <p>Mère: {dog.parents.mother.name}</p>
          <img
            src={dog.parents.mother.image}
            alt={dog.parents.mother.name}
            onClick={() => setLightboxImage(dog.parents.mother.image)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <button className="edit-btn" onClick={() => navigate(`/chiens/edit/${dog.id}`)}>Modifier</button>
          <button onClick={handleDeleteDog} className="delete-btn">Supprimer</button>
        </div>
      )}

      <div className="dog-category achievements">
        <h2>Palmarès & Résultats</h2>

        {isAdmin && (
          <div className="admin-achievements-btn">
            <button className="edit-btn" onClick={() => navigate(`/chiens/${dog.id}/achievements`)}>
              Ajouter / Modifier Palmarès & Résultats
            </button>
          </div>
        )}

        <div className="years-filter">
          {years.map((year) => (
            <button
              key={year}
              className={`year-btn ${activeYear === year ? "active" : ""}`}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {!currentYearData || Object.keys(currentYearData).length === 0 ? (
          <p>À venir</p>
        ) : (
          <>
            {/* Achievement images */}
            {currentYearData.imageURLs?.length > 0 && (
              <div className="year-section image-box">
                {currentYearData.imageURLs.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Achievement ${activeYear}`}
                    onClick={() => setLightboxImage(img)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            )}

            <div className="year-section">
              <h3>📅 Date & Événement</h3>
              <p>{currentYearData.date || "N/A"} {currentYearData.event ? `- ${currentYearData.event}` : ""}</p>
            </div>

            {currentYearData.judge && (
              <div className="year-section">
                <h3>👩‍⚖️ Juge</h3>
                <p>{currentYearData.judge}</p>
              </div>
            )}

            <div className="year-section">
              <h3>🏆 Palmarès</h3>
              {currentYearData.palmares?.length > 0 ? (
                <ul>{currentYearData.palmares.map((p, i) => <li key={i}>{p}</li>)}</ul>
              ) : <p>À venir</p>}
            </div>

            <div className="year-section">
              <h3>📊 Résultats</h3>
              {currentYearData.results?.length > 0 ? (
                <ul>{currentYearData.results.map((r, i) => <li key={i}>{r}</li>)}</ul>
              ) : <p>À venir</p>}
            </div>

            {isAdmin && (
              <div className="admin-achievements-controls">
                <button onClick={handleDeleteAchievement} className="delete-btn">
                  Supprimer cette réalisation
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
          <img src={lightboxImage} alt="Full View" className="lightbox-img" />
        </div>
      )}
    </main>
  );
}
