import React from "react";
import styles from "./styles.module.css";

interface ParamsCardProps {
  skill: string;
  time: string;
  prereq: string;
}

const ParamsCard: React.FC<ParamsCardProps> = ({ skill, time, prereq }) => {
  return (
    <div className={styles.centered}>
      <div className={styles.paramsCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>난이도</th>
              <th>소요 시간</th>
              <th>사전 준비사항</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{skill}</td>
              <td>{time}</td>
              <td>{prereq}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParamsCard;
