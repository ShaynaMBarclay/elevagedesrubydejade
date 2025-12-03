import React from "react";

export default function PedigreeNode({ label, nodePath, nodeData, update, handleImageUpload }) {
  return (
    <div className="pedigree-node">
      <h3>{label}</h3>
      <input
        type="text"
        placeholder={`Nom de ${label}`}
        value={nodeData.name || ""}
        onChange={(e) => update(`${nodePath}.name`, e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(`${nodePath}.image`, e.target.files[0])}
      />
      {nodeData.image && <img src={nodeData.image} alt={label} className="node-img" />}
    </div>
  );
}
