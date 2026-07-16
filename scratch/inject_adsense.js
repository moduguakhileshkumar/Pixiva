const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', '.gemini', 'node_modules'];
const ADSENSE_CODE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5535227871644720"\n     crossorigin="anonymous"></script>`;

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

function injectAdSense() {
  const htmlFiles = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Found ${htmlFiles.length} HTML files to inspect for AdSense script.`);

  let updatedCount = 0;

  htmlFiles.forEach(filePath => {
    const relative = path.relative(WORKSPACE_DIR, filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if client publisher code is already in file to prevent double injection
    if (!content.includes('ca-pub-5535227871644720')) {
      const headCloseIndex = content.indexOf('</head>');
      if (headCloseIndex !== -1) {
        content = content.slice(0, headCloseIndex) + `  ${ADSENSE_CODE}\n` + content.slice(headCloseIndex);
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`  ✅ Injected AdSense script in: ${relative}`);
      }
    }
  });

  console.log(`\n🎉 AdSense injection complete. Modified ${updatedCount} files.`);
}

injectAdSense();
