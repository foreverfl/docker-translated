import React from "react";
import styles from "./styles.module.css";

interface GridItemProps {
  title: string;
  description: string;
  link: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, description, link }) => {
  return (
    <a href={link} className={styles.gridItemLink}>
      <div className={styles.gridItem}>
        <h3 className={styles.gridItemTitle}>{title}</h3>
        <p className={styles.gridItemDescription}>{description}</p>
      </div>
    </a>
  );
};

export default GridItem;
