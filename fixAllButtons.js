import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, resolve } from "path";

// 디렉토리를 재귀적으로 탐색하며 모든 .md 파일 찾기
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

// Hugo의 {{< button >}} 형식을 <Button> 컴포넌트로 변환
function fixButtonsInFile(filePath) {
  const content = readFileSync(filePath, "utf-8");

  // {{< button text="..." url="..." >}}를 찾는 정규식
  const regex = /{{<\s*button\s+text="([^"]+)"\s+url="([^"]+)"\s*>}}/g;

  // 변환된 내용
  const newContent = content.replace(
    regex,
    (_, text, url) => `<Button href="${url}">\n${text}\n</Button>`
  );

  if (newContent !== content) {
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed buttons in: ${filePath}`);
  } else {
    console.log(`No changes made to: ${filePath}`);
  }
}

// 실행
const docsDir = resolve("docs"); // 문서 디렉터리 경로
const markdownFiles = findMarkdownFiles(docsDir);

markdownFiles.forEach((file) => {
  try {
    fixButtonsInFile(file);
  } catch (error) {
    console.error(`Error processing file: ${file}`);
    console.error(error);
  }
});

console.log("All button replacements completed!");