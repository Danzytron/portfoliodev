const fs = require('fs');
const path = require('path');

function createPdf() {
  const objects = [];
  
  function addObject(content) {
    const objNum = objects.length + 1;
    objects.push({ num: objNum, content });
    return objNum;
  }

  // 1: Catalog
  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  // 2: Pages
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  // 3: Page
  addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>');
  // 4: Font Bold
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  // 5: Font Regular
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const streamContent = `BT
/F1 22 Tf
50 740 Td
(ROLDAN JR. DELARMENTE) Tj
0 -22 Td
/F2 12 Tf
(Aspiring Web & App Developer) Tj
0 -18 Td
/F2 9.5 Tf
(Open to Learning & Collaboration | Cebu, Philippines) Tj
0 -26 Td
/F1 12 Tf
(PROFESSIONAL PROFILE) Tj
0 -15 Td
/F2 9.5 Tf
(Aspiring Web and App Developer who enjoys building modern, functional, and user-friendly digital experiences.) Tj
0 -13 Td
(Passionate about exploring new technologies, improving programming skills, and turning ideas into real-world applications.) Tj
0 -24 Td
/F1 12 Tf
(TECHNICAL SKILLS) Tj
0 -15 Td
/F1 9.5 Tf
(Frontend Development: ) Tj
/F2 9.5 Tf
(HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS) Tj
0 -14 Td
/F1 9.5 Tf
(Backend Development: ) Tj
/F2 9.5 Tf
(PHP, Python, Java, C++) Tj
0 -14 Td
/F1 9.5 Tf
(Database: ) Tj
/F2 9.5 Tf
(MySQL, PostgreSQL) Tj
0 -14 Td
/F1 9.5 Tf
(Mobile Development: ) Tj
/F2 9.5 Tf
(Flutter, Dart) Tj
0 -24 Td
/F1 12 Tf
(FEATURED PROJECTS) Tj
0 -16 Td
/F1 10.5 Tf
(1. School Portal System) Tj
0 -13 Td
/F2 9.5 Tf
(Academic portal organizing student records, teacher schedules, and administrative workflows.) Tj
0 -12 Td
/F2 8.5 Tf
(Technologies: Next.js, React, PHP, MySQL) Tj
0 -18 Td
/F1 10.5 Tf
(2. PrintBai - Printing Service Platform) Tj
0 -13 Td
/F2 9.5 Tf
(Fast, affordable, student-friendly printing service platform with automated pricing calculations.) Tj
0 -12 Td
/F2 8.5 Tf
(Technologies: HTML, PyScript, CSS | https://printbai.vercel.app) Tj
0 -18 Td
/F1 10.5 Tf
(3. Basketball Game - Arcade 2D Web Game) Tj
0 -13 Td
/F2 9.5 Tf
(Interactive 2D arcade basketball game with drag-to-aim shooting physics, score tracking, and swish multipliers.) Tj
0 -12 Td
/F2 8.5 Tf
(Technologies: HTML, CSS, JavaScript | https://renebasketball.vercel.app/) Tj
0 -18 Td
/F1 10.5 Tf
(4. Mobile Application) Tj
0 -13 Td
/F2 9.5 Tf
(A mobile application project focused on practical functionality, organized interfaces, and a smooth user experience.) Tj
0 -12 Td
/F2 8.5 Tf
(Technologies: Flutter, Dart) Tj
0 -26 Td
/F1 12 Tf
(DEVELOPER PHILOSOPHY) Tj
0 -15 Td
/F2 9.5 Tf
("Good design makes technology feel effortless. Useful software should be functional, intuitive, and thoughtfully designed.") Tj
ET`;

  const streamBuffer = Buffer.from(streamContent, 'utf-8');
  // 6: Stream content
  addObject(`<< /Length ${streamBuffer.length} >>\nstream\n${streamContent}\nendstream`);

  let fileContent = '%PDF-1.4\n';
  const offsets = [];

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(fileContent, 'utf-8'));
    fileContent += `${obj.num} 0 obj\n${obj.content}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(fileContent, 'utf-8');
  fileContent += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (const offset of offsets) {
    fileContent += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  fileContent += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const dest = path.join(publicDir, 'cv.pdf');
  fs.writeFileSync(dest, fileContent, 'utf-8');
  console.log(`Generated CV PDF at: ${dest} (${fs.statSync(dest).size} bytes)`);
}

createPdf();
