import React from "react";
import GridItem from "./GridItem";

interface GridProps {
  items: { title: string; description: string; link: string }[];
}

const Grid: React.FC<GridProps> = ({ items }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {items.map((item, index) => (
        <GridItem
          key={index}
          title={item.title}
          description={item.description}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default Grid;
