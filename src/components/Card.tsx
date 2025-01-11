import React from "react";

export default function Card({ title, description, link, icon }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <img
        src={icon}
        alt={`${title} icon`}
        style={{ width: "48px", height: "48px" }}
      />
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} style={{ color: "blue", textDecoration: "underline" }}>
        Learn more
      </a>
    </div>
  );
}
