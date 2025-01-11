import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

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

    const newContent = content.replace(/keywords:\s*(.*)/, newKeywords);
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed keywords in: ${filePath}`);
  } else {
    console.log(`No keywords found to fix in: ${filePath}`);
  }
}

const relativeFilePath = process.argv[2]; // 첫 번째 인수
if (!relativeFilePath) {
  console.error("Please provide a relative file path.");
  process.exit(1);
}

const absoluteFilePath = resolve(relativeFilePath); // 절대 경로로 변환
console.log(`Processing file: ${absoluteFilePath}`);
fixKeywordsInFile(absoluteFilePath);
