const fs = require('fs');
const path = require('path');

const srcBase = path.join(__dirname, '..', 'node_modules', 'devicon', 'icons');
const destDir = path.join(__dirname, '..', 'public', 'tech');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  html: 'html5/html5-original.svg',
  css: 'css3/css3-original.svg',
  javascript: 'javascript/javascript-original.svg',
  typescript: 'typescript/typescript-original.svg',
  php: 'php/php-original.svg',
  dart: 'dart/dart-original.svg',
  cpp: 'cplusplus/cplusplus-original.svg',
  java: 'java/java-original.svg',
  python: 'python/python-original.svg',
  react: 'react/react-original.svg',
  nextjs: 'nextjs/nextjs-original.svg',
  mysql: 'mysql/mysql-original.svg',
  postgresql: 'postgresql/postgresql-original.svg',
  flutter: 'flutter/flutter-original.svg'
};

for (const [key, rel] of Object.entries(map)) {
  const src = path.join(srcBase, rel);
  const dest = path.join(destDir, `${key}.svg`);
  let content = fs.readFileSync(src, 'utf-8');
  
  // For Next.js: add a very subtle white border to the circle so it's clearly distinct in dark mode
  if (key === 'nextjs') {
    content = content.replace(
      '<circle cx="64" cy="64" r="64"/>',
      '<circle cx="64" cy="64" r="63" fill="#000" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>'
    );
  }
  
  fs.writeFileSync(dest, content, 'utf-8');
  console.log(`Copied ${key} -> ${dest} (${content.length} bytes)`);
}
