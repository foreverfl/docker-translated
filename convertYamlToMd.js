#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

// 🛠️ CLI 인자 처리
if (process.argv.length < 4) {
  console.error("사용법: node convert-yaml-to-md.js <원본 YAML 절대경로> <출력 MD 절대경로>");
  process.exit(1);
}

const yamlFilePath = path.resolve(process.argv[2]); // 입력 YAML 절대경로
const mdFilePath = path.resolve(process.argv[3]);   // 출력 MDX 절대경로

// 🛠️ YAML 파일 읽기 및 파싱
try {
  const yamlContent = fs.readFileSync(yamlFilePath, "utf8");
  const data = yaml.parse(yamlContent);

  if (!data.command || !data.usage) {
    console.error("YAML 형식 오류: 'command' 또는 'usage' 필드가 없습니다.");
    process.exit(1);
  }

  // 📌 MDX 변환 템플릿
  let mdxContent = `---
title: "${data.command}"
sidebar_label: "${data.command}"
slug: "/reference/cli/docker/${data.command.replace(/\s+/g, '-')}"
---

# ${data.command}

| 항목 | 내용 |
|------|------|
| **Usage** | \`${data.usage}\` |
| **Description** | ${data.short || "-"} |
| **Aliases** | ${data.aliases ? data.aliases.split(", ").map(alias => `\`${alias}\``).join(" ") : "-"} |

## 설명
${data.long || data.short || "-"}

## 옵션
| 옵션 | 기본값 | 설명 |
|------|--------|------|
`;

  // 옵션
  if (data.options) {
    data.options.forEach(option => {
      let optionName = "";
      if (option.shorthand) {
        optionName = `\`-${option.shorthand} --${option.option}\``;
      } else {
        optionName = `\`--${option.option}\``;
      }

      let defaultValue = "";
      if (option.default_value === "false" || option.default_value === undefined) {
        defaultValue = ""; 
      } else {
        defaultValue = `\`${option.default_value}\``;
      }

      let description = option.description || "-";
      description = description.replace(/\n/g, "<br />");

      mdxContent += `| ${optionName} | ${defaultValue} | ${description} |\n`;
    });
  }

  // 예제
  if (data.examples) {
    mdxContent += "\n---\n\n## 예제\n\n";
    mdxContent += data.examples + "\n";
  }

  // 🛠️ MDX 파일 저장
  fs.writeFileSync(mdFilePath, mdxContent, "utf8");
  console.log(`✅ 변환 완료! ${mdFilePath}`);
} catch (err) {
  console.error("❌ 오류 발생:", err);
  process.exit(1);
}
