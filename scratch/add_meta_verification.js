const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', '.gemini', 'node_modules'];
const TOKEN = 'hMkvLYmRffI9Dj-gbPiLgS6iQeeUMunP_2vUq1-uCRQ';
const META_TAG = `<meta name="google-site-verification" content="${TOKEN}" />`;

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getFilesRecursively(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function runVerificationInjector() {
  const htmlFiles = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Scanning ${htmlFiles.length} HTML files for site verification headers.`);

  let modifiedCount = 0;

  htmlFiles.forEach(filePath => {
    const relativePath = path.relative(WORKSPACE_DIR, filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('google-site-verification')) {
      // Find position of </head>
      const headCloseIndex = content.indexOf('</head>');
      if (headCloseIndex !== -1) {
        content = content.slice(0, headCloseIndex) + `  ${META_TAG}\n` + content.slice(headCloseIndex);
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`  ✅ Injected verification meta tag: ${relativePath}`);
      }
    }
  });

  console.log(`\n📊 Injection complete. Modified ${modifiedCount} files.`);
}

runVerificationInjector();
