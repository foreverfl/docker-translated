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
  const regexInline = /keywords:\s*(\[[^\]]*\]|\n\s*-)/; // 이미 배열인지 확인
  const regexMultiline = /keywords:\s*\|([\s\S]*?)(\n\w|$)/; // 멀티라인 keywords 감지
  const regexSingleLine = /keywords:\s*(.*)/; // 단일 라인 keywords 감지

  // 이미 YAML 배열 형태라면 건너뜀
  if (regexInline.test(content)) {
    console.log(`Skipped (already formatted): ${filePath}`);
    return;
  }

  let newContent = content;

  // 멀티라인 처리
  const matchMultiline = content.match(regexMultiline);
  if (matchMultiline) {
    const multilineKeywords = matchMultiline[1]
      .split("\n") // 줄 단위로 분리
      .map((line) => line.trim()) // 공백 제거
      .join(" ") // 한 줄로 결합
      .split(",") // 쉼표 기준으로 나눔
      .map((keyword) => `  - ${keyword.trim()}`) // 배열 포맷으로 변환
      .join("\n");
    const newKeywords = `keywords:\n${multilineKeywords}`;
    newContent = content.replace(regexMultiline, newKeywords);
  } else {
    // 단일 라인 처리
    const matchSingleLine = content.match(regexSingleLine);
    if (matchSingleLine && !matchSingleLine[1].startsWith("-")) {
      const keywordsArray = matchSingleLine[1]
        .split(",")
        .map((keyword) => `  - ${keyword.trim()}`)
        .join("\n");
      const newKeywords = `keywords:\n${keywordsArray}`;
      newContent = content.replace(regexSingleLine, newKeywords);
    }
  }

  // 파일 내용 수정
  if (newContent !== content) {
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed keywords in: ${filePath}`);
  } else {
    console.log(`No changes made to: ${filePath}`);
  }
}
// 실행
const docsDir = join(__dirname, "docs"); // 문서 디렉터리 경로
console.log(`Scanning directory: ${docsDir}`);
const markdownFiles = findMarkdownFiles(docsDir);

markdownFiles.forEach((file) => {
  try {
    fixKeywordsInFile(file);
  } catch (error) {
    console.error(`Error processing file: ${file}`);
    console.error(error);
  }
});

console.log("All keywords fixed!");