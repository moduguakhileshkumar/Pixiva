const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', '.gemini', 'node_modules'];

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

function getPrefix(filePath) {
  const relative = path.relative(WORKSPACE_DIR, filePath);
  const parts = relative.split(path.sep);
  if (parts.length === 1) {
    return './'; // Root level
  } else if (parts.length === 2) {
    return '../'; // 1 level deep (e.g. png-to-webp/index.html)
  } else if (parts.length === 3) {
    return '../../'; // 2 levels deep (e.g. compare/webp-vs-png/index.html)
  }
  return './';
}

function cleanLinks() {
  const htmlFiles = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Found ${htmlFiles.length} HTML files to clean.`);

  let updatedCount = 0;

  htmlFiles.forEach(filePath => {
    const relative = path.relative(WORKSPACE_DIR, filePath);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const prefix = getPrefix(filePath);
    const cleanHome = prefix; // e.g. "./", "../", or "../../"

    // Replace href="...index.html" where it acts as home link
    // Specifically logo, breadcrumbs, footer-brand, bottom-nav-link
    
    // 1. Sidebar Logo: href="...index.html" class="logo"
    content = content.replace(/href="[^"]*index\.html"\s+class="logo"/g, `href="${cleanHome}" class="logo"`);
    content = content.replace(/class="logo"\s+href="[^"]*index\.html"/g, `class="logo" href="${cleanHome}"`);

    // 2. Breadcrumb home: <a href="...index.html">Pixiva</a>
    // Matches: <a href="...index.html">Pixiva</a> or <a href="...index.html">Home</a>
    content = content.replace(/<a\s+href="[^"]*index\.html">Pixiva<\/a>/g, `<a href="${cleanHome}">Pixiva</a>`);

    // 3. Footer Logo: href="...index.html" class="footer-brand"
    content = content.replace(/href="[^"]*index\.html"\s+class="footer-brand"/g, `href="${cleanHome}" class="footer-brand"`);
    content = content.replace(/class="footer-brand"\s+href="[^"]*index\.html"/g, `class="footer-brand" href="${cleanHome}"`);

    // 4. Mobile Bottom Nav home: href="...index.html" class="bottom-nav-link" data-action="home"
    content = content.replace(/href="[^"]*index\.html"\s+class="bottom-nav-link"\s+data-action="home"/g, `href="${cleanHome}" class="bottom-nav-link" data-action="home"`);
    content = content.replace(/href="[^"]*"\s+class="bottom-nav-link\s+active"\s+data-action="home"/g, `href="${cleanHome}" class="bottom-nav-link active" data-action="home"`);
    content = content.replace(/href="[^"]*"\s+class="bottom-nav-link"\s+data-action="home"/g, `href="${cleanHome}" class="bottom-nav-link" data-action="home"`);

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`  ✅ Cleaned home links in: ${relative}`);
    }
  });

  console.log(`\n🎉 Home link cleaning complete. Modified ${updatedCount} files.`);
}

cleanLinks();
