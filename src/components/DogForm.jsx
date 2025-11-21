import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/EditDog.css";

export default function DogForm({ dogId, isEdit = false }) {
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
    retraite: false,
    memoire: false,
  });

  const [newImages, setNewImages] = useState([]);
  const [newParentImages, setNewParentImages] = useState({ father: null, mother: null });

  // If editing, load existing dog
  useEffect(() => {
    if (isEdit && dogId) {
      const fetchDog = async () => {
        const docRef = doc(db, "dogs", dogId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) setFormData(snapshot.data());
      };
      fetchDog();
    }
  }, [isEdit, dogId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNested = (e, section) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [e.target.name]: e.target.value },
    });
  };

  const handleParentChange = (e, parent) => {
    setFormData({
      ...formData,
      parents: { ...formData.parents, [parent]: { ...formData.parents[parent], [e.target.name]: e.target.value } },
    });
  };

  const handleImageUpload = (e) => setNewImages([...newImages, ...e.target.files]);
  const handleParentImageUpload = (e, parent) => setNewParentImages({ ...newParentImages, [parent]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let docRef;

      if (isEdit && dogId) {
        docRef = doc(db, "dogs", dogId);
        await updateDoc(docRef, { ...formData, images: formData.images, parents: formData.parents });
      } else {
        docRef = await addDoc(collection(db, "dogs"), { ...formData, images: [], parents: formData.parents });
      }

      const finalDocId = docRef.id || dogId;

      // Upload new dog images
      const uploadedURLs = [...formData.images];
      for (let file of newImages) {
        const fileRef = ref(storage, `dogs/${finalDocId}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploadedURLs.push(url);
      }

      // Upload parent images
      const parentUploads = { ...formData.parents };
      for (let parent of ["father", "mother"]) {
        if (newParentImages[parent]) {
          const fileRef = ref(storage, `dogs/${finalDocId}/parents/${Date.now()}-${newParentImages[parent].name}`);
          await uploadBytes(fileRef, newParentImages[parent]);
          parentUploads[parent].image = await getDownloadURL(fileRef);
        }
      }

      await updateDoc(doc(db, "dogs", finalDocId), {
        images: uploadedURLs,
        parents: parentUploads,
      });

      navigate("/chiens");
    } catch (error) {
      console.error("Erreur ajout/édition chien:", error);
    }
  };

  return (
    <main className="edit-dog-page">
      <h1>{isEdit ? "Modifier le chien" : "Ajouter un nouveau chien"}</h1>
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

        <label>
          <input type="checkbox" name="retraite" checked={formData.retraite} onChange={(e) => setFormData({ ...formData, retraite: e.target.checked })} />
          Retraité
        </label>

        <label>
          <input type="checkbox" name="memoire" checked={formData.memoire} onChange={(e) => setFormData({ ...formData, memoire: e.target.checked })} />
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
            <input name="name" value={formData.parents[parent].name} onChange={(e) => handleParentChange(e, parent)} />
            <input type="file" accept="image/*" onChange={(e) => handleParentImageUpload(e, parent)} />
          </div>
        ))}

        <h2>Photos</h2>
        <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e)} className="full" />

        <button type="submit" className="save-btn">{isEdit ? "Mettre à jour" : "Enregistrer"}</button>
      </form>
    </main>
  );
}
