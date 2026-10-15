const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'node_modules', 'devicon', 'icons');
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
  flutter: 'flutter/flutter-original.svg'
};

for (const [key, rel] of Object.entries(map)) {
  const p = path.join(base, rel);
  const raw = fs.readFileSync(p, 'utf-8');
  console.log(`\n--- ${key} (${rel}) ---`);
  console.log(raw.slice(0, 300));
}
