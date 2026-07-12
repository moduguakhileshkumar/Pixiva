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

function verifyHtmlLinks() {
  const htmlFiles = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Found ${htmlFiles.length} HTML files to verify links inside.`);
  
  let totalLinksTested = 0;
  let brokenLinksCount = 0;

  htmlFiles.forEach(htmlPath => {
    const relativeHtmlPath = path.relative(WORKSPACE_DIR, htmlPath);
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    // Simple regex matching href="relative_path" and src="relative_path"
    const linkRegex = /(href|src)=["']([^"']+)["']/g;
    let match;

    console.log(`\n📄 Verifying: ${relativeHtmlPath}`);

    while ((match = linkRegex.exec(content)) !== null) {
      const attribute = match[1];
      const linkTarget = match[2];

      // Skip external links, mailto, hashes, or script variables
      if (
        linkTarget.startsWith('http') ||
        linkTarget.startsWith('mailto:') ||
        linkTarget.startsWith('#') ||
        linkTarget.startsWith('javascript:') ||
        linkTarget === ''
      ) {
        continue;
      }

      totalLinksTested++;

      // Resolve relative path to physical file
      const dirOfHtml = path.dirname(htmlPath);
      let targetPath = path.resolve(dirOfHtml, linkTarget);

      // If linking to a directory (ends with / or is a directory), check for index.html inside
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        targetPath = path.join(targetPath, 'index.html');
      }

      const exists = fs.existsSync(targetPath);
      const relativeTarget = path.relative(WORKSPACE_DIR, targetPath);

      if (exists) {
        console.log(`  ✅ [${attribute}] ${linkTarget} -> resolved to ${relativeTarget}`);
      } else {
        brokenLinksCount++;
        console.error(`  ❌ [${attribute}] BROKEN LINK: ${linkTarget} -> resolved to ${relativeTarget}`);
      }
    }
  });

  console.log(`\n📊 Testing Summary:`);
  console.log(`  Total relative links verified: ${totalLinksTested}`);
  console.log(`  Broken links found: ${brokenLinksCount}`);

  if (brokenLinksCount > 0) {
    console.error(`\n❌ LINK CHECK FAILED: Resolve the broken paths listed above.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 LINK CHECK SUCCESSFUL: All local paths resolved correctly.`);
    process.exit(0);
  }
}

verifyHtmlLinks();
