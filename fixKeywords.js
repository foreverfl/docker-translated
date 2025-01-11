const fs = require("fs");
const path = require("path");

// 디렉터리를 재귀적으로 탐색하며 모든 .md 파일 찾기
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// keywords를 Docusaurus 포맷으로 변환
function fixKeywordsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = /keywords:\s*(.*)/;

  // keywords 필드 찾기
  const match = content.match(regex);
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
    fs.writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed keywords in: ${filePath}`);
  }
}

// 실행
const docsDir = path.join(__dirname, "docs"); // 문서 디렉터리 경로
const markdownFiles = findMarkdownFiles(docsDir);

markdownFiles.forEach(fixKeywordsInFile);

console.log("All keywords fixed!");