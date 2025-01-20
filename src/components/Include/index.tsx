import React from 'react';
import fs from 'fs';
import path from 'path';

export default function Include({ file }) {
  const filePath = path.resolve(__dirname, `../includes/${file}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}