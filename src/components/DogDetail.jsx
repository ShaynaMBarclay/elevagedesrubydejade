import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import tinaImg from "../assets/tina.jpg"; 
import severkaImg from "../assets/severka.jpg"; 
import ubyImg from "../assets/uby.jpg";
import undyImg from "../assets/undy.jpg";
import "../styles/DogDetail.css";

export default function DogDetail() {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const [activeYear, setActiveYear] = useState("2025");

  const allDogs = [
    {
      id: "1",
      name: "Tina De l'empreinte des Bergers",
      type: "Berger Blanc Suisse",
      sex: "Femelle",
      birth: "01/01/2020",
      microchip: "1234567890",
      lof: "France",
      originNumber: "/",
      rating: "A confirmer",
      dna: "Enregistré",
      health: {
        elbowDysplasia: "0",
        hipDysplasia: "A",
        md: "N/N",
        mdr1: "+/+",
        nah: "N/N"
      },
      parents: {
        father: "Papa Tina",
        mother: "Maman Tina",
        fatherImg: tinaImg,
        motherImg: tinaImg
      },
      pedigreeLink: "#",
      palmares: ["Champion régional 2023", "CAC 2024"],
      results: ["Meilleur chien expo 2025"],
      image: tinaImg,
    },
    {
      id: "2",
      name: "Severka iii od Úhoště",
      type: "Chien-loup tchecoslovaque",
      sex: "Femelle",
      birth: "15/03/2019",
      microchip: "0987654321",
      lof: "France",
      originNumber: "/",
      rating: "A confirmer",
      dna: "Enregistré",
      health: {
        elbowDysplasia: "1",
        hipDysplasia: "B",
        md: "N/N",
        mdr1: "+/+",
        nah: "N/N"
      },
      parents: {
        father: "Papa Severka",
        mother: "Maman Severka",
        fatherImg: severkaImg,
        motherImg: severkaImg
      },
      pedigreeLink: "#",
      palmares: ["CAC 2023"],
      results: ["2ème meilleur chien expo 2024"],
      image: severkaImg,
    },
    {
      id: "3",
      name: "Uby Des Ruby De Jade",
      type: "Chien-loup tchecoslovaque",
      sex: "Femelle",
      birth: "10/06/2021",
      microchip: "1122334455",
      lof: "France",
      originNumber: "/",
      rating: "A confirmer",
      dna: "Enregistré",
      health: {
        elbowDysplasia: "0",
        hipDysplasia: "A",
        md: "N/N",
        mdr1: "+/+",
        nah: "N/N"
      },
      parents: {
        father: "Papa Uby",
        mother: "Maman Uby",
        fatherImg: ubyImg,
        motherImg: ubyImg
      },
      pedigreeLink: "#",
      palmares: [],
      results: [],
      image: ubyImg,
    },
    {
      id: "4",
      name: "Undy Des Ruby De Jade",
      type: "Chien-loup tchecoslovaque",
      sex: "Femelle",
      birth: "05/05/2020",
      microchip: "6677889900",
      lof: "France",
      originNumber: "/",
      rating: "A confirmer",
      dna: "Enregistré",
      health: {
        elbowDysplasia: "0",
        hipDysplasia: "A",
        md: "N/N",
        mdr1: "+/+",
        nah: "N/N"
      },
      parents: {
        father: "Papa Undy",
        mother: "Maman Undy",
        fatherImg: undyImg,
        motherImg: undyImg
      },
      pedigreeLink: "#",
      palmares: [],
      results: [],
      image: undyImg,
    },
  ];

  const dog = allDogs.find((d) => d.id === id);
  if (!dog) return <p>Chien non trouvé</p>;

  const years = ["2025", "2024", "2023", "2022"];
  const handleYearClick = (year) => setActiveYear(year);

  return (
    <main className="dog-detail-page">
      <Link to="/Chiens">← Retour à nos chiens</Link>
      <h1>{dog.name}</h1>
      <p>{dog.sex} {dog.type} née le {dog.birth}</p>
      <img src={dog.image} alt={dog.name} />

      {/* ADMIN BUTTONS (only show if logged in) */}
      {isAdmin && (
        <div className="admin-controls">
          <Link to={`/chiens/edit/${dog.id}`} className="edit-btn">
           Modifier
          </Link>
         <button className="delete-btn">Supprimer</button>
        </div>
        )}

      {/* Informations */}
      <div className="dog-category informations">
        <h2>Informations</h2>
        <p><strong>Sexe:</strong> {dog.sex}</p>
        <p><strong>Puce:</strong> {dog.microchip}</p>
        <p><strong>Inscrit au LOF ?</strong> {dog.lof}</p>
        <p><strong>N° origine:</strong> {dog.originNumber}</p>
        <p><strong>Cotation:</strong> {dog.rating}</p>
        <p><strong>ADN:</strong> {dog.dna}</p>
        <p><strong>Tares:</strong></p>
        <ul>
          <li>Dysplasie Coude (ED): {dog.health.elbowDysplasia}</li>
          <li>Dysplasie Hanche (HD): {dog.health.hipDysplasia}</li>
          <li>MD: {dog.health.md}</li>
          <li>Mutation MDR1: {dog.health.mdr1}</li>
          <li>Nanisme hypophysaire (NAH): {dog.health.nah}</li>
        </ul>
      </div>

      {/* Parents */}
      <div className="dog-category parents">
        <h2>Les parents</h2>
        <div>
          <p>Père: {dog.parents.father}</p>
          <img src={dog.parents.fatherImg} alt={dog.parents.father} />
        </div>
        <div>
          <p>Mère: {dog.parents.mother}</p>
          <img src={dog.parents.motherImg} alt={dog.parents.mother} />
        </div>
      </div>

      <button className="pedigree-btn">Voir le pédigree complet</button>

      {/* Palmares */}
      <div className="dog-category palmares">
        <h2>Palmarès</h2>
        {dog.palmares.length > 0 ? (
          <ul>
            {dog.palmares.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        ) : <p>À venir</p>}
      </div>

      {/* Résultats */}
      <div className="dog-category results">
        <h2>Résultats</h2>
        <div className="years-filter">
          {years.map((year) => (
            <button
              key={year}
              className={`year-btn ${activeYear === year ? "active" : ""}`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="results-list">
          <p>Les résultats de {activeYear} apparaîtront ici.</p>
        </div>
      </div>
    </main>
  );
}
