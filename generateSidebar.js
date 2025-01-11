const fs = require("fs");
const path = require("path");

const docsRoot = path.join(__dirname, "docs");

function generateSidebar(dir) {
  const items = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      items.push({
        type: "category",
        label: file,
        items: generateSidebar(fullPath),
      });
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      // Markdown 파일인 경우
      const id = path.relative(docsRoot, fullPath).replace(/\\/g, "/").replace(/\.mdx?$/, "");
      items.push(id);
    }
  });

  return items;
}

// 사이드바 생성
const sidebars = {
  getStarted: generateSidebar(path.join(docsRoot, "get-started")),
  manual: generateSidebar(path.join(docsRoot, "manual")),
  reference: generateSidebar(path.join(docsRoot, "reference")),
};

// TypeScript 파일로 저장
fs.writeFileSync(
  path.join(__dirname, "sidebars.js"),
  `module.exports = {
  sidebars: ${JSON.stringify(sidebars, null, 2)}
};
`,
  "utf-8"
);

console.log("Sidebar 파일이 성공적으로 생성되었습니다.");
