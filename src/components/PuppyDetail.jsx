import { useParams, Link } from "react-router-dom";
import "../styles/PuppyDetail.css";
import puppy1Img from "../assets/tina.jpg";

export default function PuppyDetail() {
  const { id } = useParams();

  const allPuppies = [
    {
      id: "test-puppy",
      name: "Chiot 1",
      type: "Chien-loup tchecoslovaque",
      sex: "Femelle",
      birth: "01/01/2025",
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
        father: "Papa 1",
        mother: "Maman 1",
        fatherImg: puppy1Img,
        motherImg: puppy1Img
      },
      pedigreeLink: "#",
      palmares: [],
      results: [],
      image: puppy1Img
    },
    // Add more puppies here
  ];

  const puppy = allPuppies.find((p) => p.id === id);
  if (!puppy) return <p>Chiot non trouvé</p>;

  return (
    <main className="puppy-detail-page">
      <Link to="/Chiots">← Retour à nos chiots</Link>
      <h1>{puppy.name}</h1>
      <p>{puppy.sex} {puppy.type} née le {puppy.birth}</p>
      <img src={puppy.image} alt={puppy.name} />

      {/* Informations */}
      <div className="puppy-category informations">
        <h2>Informations</h2>
        <p><strong>Sexe:</strong> {puppy.sex}</p>
        <p><strong>Puce:</strong> {puppy.microchip}</p>
        <p><strong>Inscrit au LOF ?</strong> {puppy.lof}</p>
        <p><strong>N° origine:</strong> {puppy.originNumber}</p>
        <p><strong>Cotation:</strong> {puppy.rating}</p>
        <p><strong>ADN:</strong> {puppy.dna}</p>
        <p><strong>Tares:</strong></p>
        <ul>
          <li>Dysplasie Coude (ED): {puppy.health.elbowDysplasia}</li>
          <li>Dysplasie Hanche (HD): {puppy.health.hipDysplasia}</li>
          <li>MD: {puppy.health.md}</li>
          <li>Mutation MDR1: {puppy.health.mdr1}</li>
          <li>Nanisme hypophysaire (NAH): {puppy.health.nah}</li>
        </ul>
      </div>

      {/* Parents */}
<div className="puppy-category parents">
  <h2>Les parents</h2>
  <div>
    <p>Père: {puppy.parents.father}</p>
    <img src={puppy.parents.fatherImg} alt={puppy.parents.father} />
  </div>
  <div>
    <p>Mère: {puppy.parents.mother}</p>
    <img src={puppy.parents.motherImg} alt={puppy.parents.mother} />
  </div>
</div>
{/* Pedigree button below the parents */}
<button className="pedigree-btn">Voir le pédigree complet</button>


      {/* Palmares */}
      <div className="puppy-category palmares">
        <h2>Palmarès</h2>
        <p>À venir</p>
      </div>

      {/* Résultats with year filters */}
      <div className="puppy-category results">
        <h2>Résultats</h2>
        <div className="years-filter">
          {["2025", "2024", "2023", "2022"].map((year) => (
            <button key={year} className="year-btn">{year}</button>
          ))}
        </div>
        <div className="results-list">
          <p>Les résultats de l'année sélectionnée apparaîtront ici.</p>
        </div>
      </div>
    </main>
  );
}
