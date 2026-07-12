const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['.git', '.gemini', 'node_modules'];
const VALID_EXTENSIONS = ['.html', '.js', '.json', '.xml', '.txt', '.css', '.md'];

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getFilesRecursively(filePath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (VALID_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

function runRebrand() {
  const files = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Found ${files.length} code files to rebrand.`);
  
  let filesModified = 0;
  let totalReplacements = 0;

  files.forEach(filePath => {
    const relativePath = path.relative(WORKSPACE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains "pixiva" (case insensitive)
    const containsPixiva = content.toLowerCase().includes('pixiva');
    
    if (containsPixiva) {
      // Precise case replacements
      // 1. Pixiva -> Pixiva
      // 2. pixiva -> pixiva
      // 3. PIXIVA -> PIXIVA
      let updatedContent = content
        .replace(/Pixiva/g, 'Pixiva')
        .replace(/pixiva/g, 'pixiva')
        .replace(/PIXIVA/g, 'PIXIVA');
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      filesModified++;
      console.log(`  ✅ Rebranded: ${relativePath}`);
    }
  });

  console.log(`\n📊 Rebranding Summary:`);
  console.log(`  Files modified: ${filesModified}`);
  console.log(`  Branding successfully migrated to Pixiva.`);
}

runRebrand();
