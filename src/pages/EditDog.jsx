import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import "../styles/EditDog.css";

export default function EditDog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dogBreeds = ["Chien-loup tchecoslovaque", "Berger Blanc Suisse"];

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    sex: "",
    birth: "",
    microchip: "",
    lof: "",
    originNumber: "",
    rating: "",
    dna: "",
    health: {
      elbowDysplasia: "",
      hipDysplasia: "",
      md: "",
      mdr1: "",
      nah: "",
    },
    parents: {
      father: { name: "", image: "" },
      mother: { name: "", image: "" },
    },
    images: [],
    category: "chiots",
  });

  const [newImages, setNewImages] = useState([]);
  const [newParentImages, setNewParentImages] = useState({ father: null, mother: null });

  // Load dog data
  useEffect(() => {
    const loadDog = async () => {
      const docRef = doc(db, "dogs", id);
      const snap = await getDoc(docRef);

      if (!snap.exists()) return;

      const data = snap.data();

      setFormData({
        ...data,
        health: {
          elbowDysplasia: data?.health?.elbowDysplasia || "",
          hipDysplasia: data?.health?.hipDysplasia || "",
          md: data?.health?.md || "",
          mdr1: data?.health?.mdr1 || "",
          nah: data?.health?.nah || "",
        },
        parents: {
          father: { name: data?.parents?.father?.name || "", image: data?.parents?.father?.image || "" },
          mother: { name: data?.parents?.mother?.name || "", image: data?.parents?.mother?.image || "" },
        },
        images: data.images || [],
      });
    };

    loadDog();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNested = (e, section) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleParentChange = (e, parent) => {
    setFormData({
      ...formData,
      parents: {
        ...formData.parents,
        [parent]: {
          ...formData.parents[parent],
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  const handleImageUpload = (e) => setNewImages([...newImages, ...e.target.files]);
  const handleParentImageUpload = (e, parent) => {
    setNewParentImages({ ...newParentImages, [parent]: e.target.files[0] });
  };

  const extractPathFromUrl = (url) => {
    const base = `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/o/`;
    const path = url.replace(base, "").split("?")[0];
    return decodeURIComponent(path);
  };

  const removeImage = async (url, parent = null) => {
    try {
      const filePath = extractPathFromUrl(url);
      const imageRef = ref(storage, filePath);
      await deleteObject(imageRef);

      if (parent) {
        setFormData({
          ...formData,
          parents: {
            ...formData.parents,
            [parent]: { ...formData.parents[parent], image: "" },
          },
        });
      } else {
        setFormData({
          ...formData,
          images: formData.images.filter((img) => img !== url),
        });
      }

    } catch (err) {
      console.error("Erreur suppression image:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = doc(db, "dogs", id);
    const uploadedURLs = [];

    // Upload dog images
    for (let file of newImages) {
      const fileRef = ref(storage, `dogs/${id}/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      uploadedURLs.push(url);
    }

    // Upload parent images
    const parentUploads = { father: "", mother: "" };
    for (let parent of ["father", "mother"]) {
      if (newParentImages[parent]) {
        const fileRef = ref(storage, `dogs/${id}/parents/${Date.now()}-${newParentImages[parent].name}`);
        await uploadBytes(fileRef, newParentImages[parent]);
        parentUploads[parent] = await getDownloadURL(fileRef);
      }
    }

    const updatedDog = {
      ...formData,
      images: [...formData.images, ...uploadedURLs],
      parents: {
        father: { ...formData.parents.father, image: parentUploads.father || formData.parents.father.image },
        mother: { ...formData.parents.mother, image: parentUploads.mother || formData.parents.mother.image },
      },
    };

    await updateDoc(docRef, updatedDog);
    navigate(`/Chiens/${id}`);
  };

  return (
    <main className="edit-dog-page">
      <h1>Modifier {formData.name}</h1>
      <form className="edit-dog-form" onSubmit={handleSubmit} autoComplete="off">

        <h2>Informations générales</h2>

        <label className="full">Nom</label>
        <input className="full" name="name" value={formData.name} onChange={handleChange} />

        <label>Race</label>
        <select name="breed" value={formData.breed} onChange={handleChange}>
          <option value="">Sélectionner la race</option>
          {dogBreeds.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <label>Sexe</label>
         <select name="sex" value={formData.sex} onChange={handleChange}>
         <option value="">Sélectionner le sexe</option>
         <option value="Mâle">Mâle</option>
         <option value="Femelle">Femelle</option>
        </select>

        <label>Date de naissance</label>
        <input name="birth" value={formData.birth} onChange={handleChange} />

        <label>Numéro de puce</label>
        <input name="microchip" value={formData.microchip} onChange={handleChange} />

        <label>LOF</label>
        <input name="lof" value={formData.lof} onChange={handleChange} />

        <label>N° Origine</label>
        <input name="originNumber" value={formData.originNumber} onChange={handleChange} />

        <label>DNA</label>
        <input name="dna" value={formData.dna} onChange={handleChange} />

        <label>Évaluation</label>
        <input name="rating" value={formData.rating} onChange={handleChange} />

  <label className="checkbox-label">
  <input
    type="checkbox"
    name="retraite"
    checked={formData.retraite || false}
    onChange={(e) =>
      setFormData({ ...formData, retraite: e.target.checked })
    }
  />
  Retraité
</label>

<label className="checkbox-label">
  <input
    type="checkbox"
    name="memoire"
    checked={formData.memoire || false}
    onChange={(e) =>
      setFormData({ ...formData, memoire: e.target.checked })
    }
  />
  En mémoire
</label>

        <h2>Santé</h2>
        {["elbowDysplasia", "hipDysplasia", "md", "mdr1", "nah"].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input name={field} value={formData.health[field]} onChange={(e) => handleNested(e, "health")} />
          </div>
        ))}

        <h2>Parents</h2>
        {["father", "mother"].map((parent) => (
          <div key={parent}>
            <label>{parent === "father" ? "Père" : "Mère"}</label>
            <input
              name="name"
              value={formData.parents[parent].name}
              onChange={(e) => handleParentChange(e, parent)}
            />
            <div className="parent-image-section">
              {formData.parents[parent].image && (
                <div className="photo-wrapper">
                  <img src={formData.parents[parent].image} alt={parent} className="dog-photo" />
                  <button type="button" onClick={() => removeImage(formData.parents[parent].image, parent)}>Supprimer</button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleParentImageUpload(e, parent)} />
            </div>
          </div>
        ))}

        <h2>Photos</h2>
        <div className="current-images full">
          {formData.images?.map((img, i) => (
            <div key={i} className="photo-wrapper">
              <img src={img} className="dog-photo" />
              <button type="button" className="delete-photo-btn" onClick={() => removeImage(img)}>Supprimer</button>
            </div>
          ))}
        </div>

        <label className="full">Ajouter des photos</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="full" />

        <button type="submit" className="save-btn full">Enregistrer</button>
      </form>
    </main>
  );
}
