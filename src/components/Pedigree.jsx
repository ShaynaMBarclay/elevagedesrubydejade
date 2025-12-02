import "../styles/Pedigree.css";
import placeholder from "../assets/placeholder.png";

export default function Pedigree({ dog }) {
  const p = dog.pedigree;

  return (
    <div className="pedigree-tree">

      {/* SUBJECT */}
      <div className="tree-level subject">
        <div className="tree-box">
          <h3>Sujet</h3>
          <img src={p.subject.image || placeholder} alt={p.subject?.name || dog.name} />
          <p>{p.subject.name || dog.name}</p>
        </div>
      </div>

      {/* PARENTS */}
      <div className="tree-level two">
        <div className="tree-box">
          <h3>Père</h3>
          <img src={p.father.image || placeholder} alt={p.father.name} />
          <p>{p.father.name}</p>
        </div>

        <div className="tree-box">
          <h3>Mère</h3>
          <img src={p.mother.image || placeholder} alt={p.mother.name} />
          <p>{p.mother.name}</p>
        </div>
      </div>

      {/* GRANDPARENTS */}
<div className="tree-level four">
  {/* Paternal Grandparents */}
  <div className="tree-box small paternal">
    <h4>Grand-père paternel</h4>
    <img src={p.paternalGF.image || placeholder} alt={p.paternalGF.name} />
    <p>{p.paternalGF.name}</p>
  </div>

  <div className="tree-box small paternal">
    <h4>Grand-mère paternelle</h4>
    <img src={p.paternalGM.image || placeholder} alt={p.paternalGM.name} />
    <p>{p.paternalGM.name}</p>
  </div>

  {/* Maternal Grandparents */}
  <div className="tree-box small maternal">
    <h4>Grand-père maternel</h4>
    <img src={p.maternalGF.image || placeholder} alt={p.maternalGF.name} />
    <p>{p.maternalGF.name}</p>
  </div>

  <div className="tree-box small maternal">
    <h4>Grand-mère maternelle</h4>
    <img src={p.maternalGM.image || placeholder} alt={p.maternalGM.name} />
    <p>{p.maternalGM.name}</p>
  </div>
</div>


    </div>
  );
}
