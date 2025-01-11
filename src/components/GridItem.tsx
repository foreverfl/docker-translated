import React from "react";

interface GridItemProps {
  title: string;
  description: string;
  link: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, description, link }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        margin: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <p style={{ marginBottom: "20px" }}>{description}</p>
      <a
        href={link}
        style={{
          textDecoration: "none",
          color: "#0078D4",
          fontWeight: "bold",
        }}
      >
        Learn more
      </a>
    </div>
  );
};

export default GridItem;
