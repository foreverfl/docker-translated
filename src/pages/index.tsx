import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";
import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Docker 문서 번역본"
      description="Docker 문서의 번역본을 제공합니다."
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Docker 문서</h1>
        <p className={styles.subtitle}>
          이 사이트는 Docker 공식 문서를 한국어 및 일본어로 번역하여 제공합니다.
        </p>
        <a className={styles.button} href="/get-started/get-docker">
          문서 시작하기
        </a>
      </div>
    </Layout>
  );
}
