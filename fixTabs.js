import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

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
const filePath = resolve("docs/manuals/admin/organization/manage-a-team.md");
try {
  fixTabsInFile(filePath);
} catch (error) {
  console.error(`Error processing file: ${filePath}`);
  console.error(error);
}

console.log("Tab replacement completed for the specified file!")