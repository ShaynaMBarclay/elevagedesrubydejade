import { useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/EditDog.css";

export default function EditDog() {
  const { id } = useParams();

  // TODO: Replace with Firebase fetch
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sex: "",
    birth: "",
    microchip: "",
    lof: "",
    originNumber: "",
    rating: "",
    dna: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="edit-dog-page">
      <h1>Modifier le chien #{id}</h1>

     <form className="edit-dog-form">

  <label className="full">Nom</label>
  <input
    className="full"
    name="name"
    value={formData.name}
    onChange={handleChange}
  />

  <label>Race</label>
  <input name="type" value={formData.type} onChange={handleChange} />

  <label>Sexe</label>
  <input name="sex" value={formData.sex} onChange={handleChange} />

  <label>Date de naissance</label>
  <input name="birth" value={formData.birth} onChange={handleChange} />

  <label>Puce</label>
  <input name="microchip" value={formData.microchip} onChange={handleChange} />

  <label>Inscrit LOF</label>
  <input name="lof" value={formData.lof} onChange={handleChange} />

  <label>N° origine</label>
  <input name="originNumber" value={formData.originNumber} onChange={handleChange} />

  <label>Cotation</label>
  <input name="rating" value={formData.rating} onChange={handleChange} />

  <label>ADN</label>
  <input name="dna" value={formData.dna} onChange={handleChange} />

  <button type="submit" className="save-btn full">
    Enregistrer
  </button>

</form>

    </main>
  );
}
