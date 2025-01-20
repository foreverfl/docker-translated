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

// Hugo의 tabs와 tab 형식을 Docusaurus 형식으로 변환
function fixTabsInFile(filePath) {
  const content = readFileSync(filePath, "utf-8");

  // {{< tabs >}}를 <Tabs>로 변환
  const tabsStartRegex = /{{<\s*tabs\s*>}}/g;
  const tabsEndRegex = /{{<\s*\/tabs\s*>}}/g;

  // {{< tab name="..." >}}를 <TabItem value="..." label="...">로 변환
  const tabStartRegex = /{{<\s*tab\s+name="([^"]+)"\s*>}}/g;
  const tabEndRegex = /{{<\s*\/tab\s*>}}/g;

  let newContent = content;

  // 변환 순서: 시작 태그 → 종료 태그
  newContent = newContent.replace(tabsStartRegex, "<Tabs>");
  newContent = newContent.replace(tabsEndRegex, "</Tabs>");
  newContent = newContent.replace(tabStartRegex, (_, name) => {
    const value = name.toLowerCase().replace(/\s+/g, "-"); // 고유 value 생성
    return `<TabItem value="${value}" label="${name}">`;
  });
  newContent = newContent.replace(tabEndRegex, "</TabItem>");

  // 변경이 있으면 저장
  if (newContent !== content) {
    writeFileSync(filePath, newContent, "utf-8");
    console.log(`Fixed tabs in: ${filePath}`);
  } else {
    console.log(`No changes made to: ${filePath}`);
  }
}

// 실행
const docsDir = resolve("docs"); // 문서 디렉터리 경로
const markdownFiles = findMarkdownFiles(docsDir);

markdownFiles.forEach((file) => {
  try {
    fixTabsInFile(file);
  } catch (error) {
    console.error(`Error processing file: ${file}`);
    console.error(error);
  }
});

console.log("All tab replacements completed!");
