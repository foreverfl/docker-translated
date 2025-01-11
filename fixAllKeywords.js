import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

// 디렉터리를 재귀적으로 탐색하며 모든 .md 파일 찾기
function findMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// keywords를 Docusaurus 포맷으로 변환
function fixKeywordsInFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const regex = /keywords:\s*(\[[^\]]*\]|\n\s*-)/;

  // 이미 YAML 배열 형태라면 건너뜀
  if (regex.test(content)) {
    console.log(`Skipped (already formatted): ${filePath}`);
    return;
  }

  const match = content.match(/keywords:\s*(.*)/);
  if (match && !match[1].startsWith("-")) {
    // 쉼표로 분리된 문자열을 YAML 배열로 변환
    const keywordsArray = match[1]
      .split(",")
      .map((keyword) => keyword.trim())
      .map((keyword) => `  - ${keyword}`)
      .join("\n");
    const newKeywords = `keywords:\n${keywordsArray}`;

    // 파일 내용 수정
    const newContent = content.replace(regex, newKeywords);
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed keywords in: ${filePath}`);
  }
}

// 실행
const docsDir = join(__dirname, "docs"); // 문서 디렉터리 경로
const markdownFiles = findMarkdownFiles(docsDir);
markdownFiles.forEach(fixKeywordsInFile);
console.log("All keywords fixed!");