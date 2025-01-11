import React from "react";
import GridItem from "../GridItem";
import styles from "./styles.module.css";

interface GridProps {
  items: { title: string; description: string; link: string }[];
}

const Grid: React.FC<GridProps> = ({ items }) => {
  return (
    <div className={styles.container}>
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
