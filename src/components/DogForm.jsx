import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/EditDog.css";
import placeholder from "../assets/placeholder.png";

export default function DogForm({ dogId, isEdit = false, defaultCategory }) {
  const navigate = useNavigate();

  const dogBreeds = ["Chien-loup tchecoslovaque", "Berger Blanc Suisse"];
  const puppyFilters = [
    "Chiots",
    "Chiots disponibles",
    "Futures Portées",
    "Chiots nés chez nous",
  ];

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
    category: defaultCategory || "chiots",
    retraite: false,
    memoire: false,
  });

  const [selectedFilters, setSelectedFilters] = useState([]); // start empty
  const [newImages, setNewImages] = useState([]);
  const [newParentImages, setNewParentImages] = useState({
    father: null,
    mother: null,
  });

  // Load existing dog/puppy if editing
  useEffect(() => {
    if (isEdit && dogId) {
      const fetchDog = async () => {
        const col = formData.category === "chiots" ? "puppies" : "dogs";
        const docRef = doc(db, col, dogId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setFormData(snapshot.data());
          if (snapshot.data().filters) setSelectedFilters(snapshot.data().filters);
        }
      };
      fetchDog();
    }
  }, [isEdit, dogId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const handleImageUpload = (e) =>
    setNewImages([...newImages, ...e.target.files]);

  const handleParentImageUpload = (e, parent) =>
    setNewParentImages({
      ...newParentImages,
      [parent]: e.target.files[0],
    });

  const handleFilterToggle = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collectionName = formData.category === "chiots" ? "puppies" : "dogs";

      const dataToSave = {
        ...formData,
        filters: selectedFilters,
        images: formData.images,
        parents: formData.parents,
      };

      let docRef;
      if (isEdit && dogId) {
        docRef = doc(db, collectionName, dogId);
        await updateDoc(docRef, dataToSave);
      } else {
        docRef = await addDoc(collection(db, collectionName), dataToSave);
      }

      const finalDocId = docRef.id || dogId;

      // Upload new images
      const uploadedImages = [...formData.images];
      for (let file of newImages) {
        const fileRef = ref(
          storage,
          `${collectionName}/${finalDocId}/${Date.now()}-${file.name}`
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploadedImages.push(url);
      }

      // Upload parent images
      const finalParents = { ...formData.parents };
      for (let parent of ["father", "mother"]) {
        if (newParentImages[parent]) {
          const fileRef = ref(
            storage,
            `${collectionName}/${finalDocId}/parents/${Date.now()}-${
              newParentImages[parent].name
            }`
          );
          await uploadBytes(fileRef, newParentImages[parent]);
          finalParents[parent].image = await getDownloadURL(fileRef);
        }
      }

      // Update doc with final image URLs
      await updateDoc(doc(db, collectionName, finalDocId), {
        images: uploadedImages,
        parents: finalParents,
      });

      navigate(formData.category === "chiots" ? "/chiots" : "/chiens");
    } catch (error) {
      console.error("Erreur ajout/édition chien/chiot:", error);
    }
  };

  return (
    <main className="edit-dog-page">
      <h1>
        {isEdit ? "Modifier" : "Ajouter"} un{" "}
        {formData.category === "chiots" ? "chiot" : "chien"}
      </h1>

      <form className="edit-dog-form" onSubmit={handleSubmit}>
        <h2>Informations générales</h2>

        {/* CATEGORY SELECTOR */}
        <label className="full">Catégorie</label>
        <select
          className="full"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="chiots">Chiot</option>
          <option value="adultes">Chien adulte</option>
        </select>

        <label className="full">Nom</label>
        <input
          className="full"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Race</label>
        <select name="breed" value={formData.breed} onChange={handleChange}>
          <option value="">Sélectionner la race</option>
          {dogBreeds.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <label>Sexe</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Sélectionner</option>
          <option value="Mâle">Mâle</option>
          <option value="Femelle">Femelle</option>
        </select>

        <label>Date de naissance</label>
        <input name="birth" value={formData.birth} onChange={handleChange} />

        <label>Numéro de puce</label>
        <input
          name="microchip"
          value={formData.microchip}
          onChange={handleChange}
        />

        <label>LOF</label>
        <input name="lof" value={formData.lof} onChange={handleChange} />

        <label>N° Origine</label>
        <input
          name="originNumber"
          value={formData.originNumber}
          onChange={handleChange}
        />

        <label>DNA</label>
        <input name="dna" value={formData.dna} onChange={handleChange} />

        <label>Évaluation</label>
        <input name="rating" value={formData.rating} onChange={handleChange} />

        {/* Puppy Filters */}
        {formData.category === "chiots" && (
          <>
            <h2>Filtres</h2>
            <div className="puppy-filters">
              {puppyFilters.map((filter) => (
                <label key={filter} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(filter)}
                    onChange={() => handleFilterToggle(filter)}
                  />
                  {filter}
                </label>
              ))}
            </div>
          </>
        )}

        <h2>Santé</h2>
        {["elbowDysplasia", "hipDysplasia", "md", "mdr1", "nah"].map((f) => (
          <div key={f}>
            <label>{f}</label>
            <input
              name={f}
              value={formData.health[f]}
              onChange={(e) => handleNested(e, "health")}
            />
          </div>
        ))}

        <h2>Parents</h2>
        {["father", "mother"].map((parent) => (
          <div key={parent} className="parent-block">
            <label>{parent === "father" ? "Père" : "Mère"}</label>

            <input
              name="name"
              value={formData.parents[parent].name}
              onChange={(e) => handleParentChange(e, parent)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleParentImageUpload(e, parent)}
            />

            <img
              src={
                newParentImages[parent]
                  ? URL.createObjectURL(newParentImages[parent])
                  : formData.parents[parent].image || placeholder
              }
              alt={formData.parents[parent].name || parent}  loading="lazy"
              className="preview-img"
            />
          </div>
        ))}

        <h2>Photos</h2>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        <div className="dog-images-preview">
          {formData.images.map((img, i) => (
            <img key={i} src={img} alt="" className="preview-img"  loading="lazy" />
          ))}
          {newImages.map((file, i) => (
            <img key={"new" + i} src={URL.createObjectURL(file)} className="preview-img"  loading="lazy" />
          ))}
        </div>

        <button type="submit" className="save-btn">
          {isEdit ? "Mettre à jour" : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}
