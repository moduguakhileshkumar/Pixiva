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

function generateSidebar(filePath, prefix) {
  const relative = path.relative(WORKSPACE_DIR, filePath);
  const dirName = path.dirname(relative).replace(/\\/g, '/');

  const isActive = (folder) => dirName === folder ? 'active' : '';

  return `<nav class="sidebar-nav">
        <!-- Favorites dynamic section -->
        <div id="favorites-nav-section" style="display: none;"></div>

        <div class="nav-section-title">Workspace Tools</div>
        <a href="${prefix}image-compressor/" class="nav-link ${isActive('image-compressor')}">
          <i class="fa-solid fa-minimize"></i>
          <span>Image Compressor</span>
        </a>
        <a href="${prefix}image-resizer/" class="nav-link ${isActive('image-resizer')}">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
          <span>Image Resizer</span>
        </a>
        <a href="${prefix}image-blur/" class="nav-link ${isActive('image-blur')}">
          <i class="fa-solid fa-eye-slash"></i>
          <span>Focal Blur Editor</span>
        </a>
        <a href="${prefix}color-picker/" class="nav-link ${isActive('color-picker')}">
          <i class="fa-solid fa-eye-dropper"></i>
          <span>Color Picker</span>
        </a>
        
        <div class="nav-section-title">Converters</div>
        <a href="${prefix}webp-to-png/" class="nav-link ${isActive('webp-to-png')}"><span>WebP → PNG</span></a>
        <a href="${prefix}png-to-webp/" class="nav-link ${isActive('png-to-webp')}"><span>PNG → WebP</span></a>
        <a href="${prefix}heic-to-jpg/" class="nav-link ${isActive('heic-to-jpg')}"><span>HEIC → JPG</span></a>
        <a href="${prefix}avif-to-png/" class="nav-link ${isActive('avif-to-png')}"><span>AVIF → PNG</span></a>
        <a href="${prefix}svg-to-png/" class="nav-link ${isActive('svg-to-png')}"><span>SVG → PNG</span></a>
        <a href="${prefix}png-to-ico/" class="nav-link ${isActive('png-to-ico')}"><span>PNG → ICO</span></a>
        <a href="${prefix}jpg-to-png/" class="nav-link ${isActive('jpg-to-png')}"><span>JPG → PNG</span></a>
        <a href="${prefix}png-to-jpg/" class="nav-link ${isActive('png-to-jpg')}"><span>PNG → JPG</span></a>
        <a href="${prefix}webp-to-jpg/" class="nav-link ${isActive('webp-to-jpg')}"><span>WebP → JPG</span></a>

        <div class="nav-section-title">Developer Tools</div>
        <a href="${prefix}json-formatter/" class="nav-link ${isActive('json-formatter')}"><span>JSON Formatter</span></a>
        <a href="${prefix}jwt-decoder/" class="nav-link ${isActive('jwt-decoder')}"><span>JWT Decoder</span></a>
        <a href="${prefix}markdown-editor/" class="nav-link ${isActive('markdown-editor')}"><span>Markdown Editor</span></a>
        <a href="${prefix}qr-toolkit/" class="nav-link ${isActive('qr-toolkit')}"><span>QR Toolkit</span></a>
        <a href="${prefix}text-cleaner/" class="nav-link ${isActive('text-cleaner')}"><span>Text Cleaner</span></a>
        <a href="${prefix}timestamp-converter/" class="nav-link ${isActive('timestamp-converter')}"><span>Timestamp Conv</span></a>
        <a href="${prefix}unit-converter/" class="nav-link ${isActive('unit-converter')}"><span>Unit Converter</span></a>
      </nav>`;
}

function generateFooter(prefix) {
  return `<footer class="app-footer">
          <div class="footer-row" style="align-items: flex-start;">
            <div class="footer-column" style="flex: 2; min-width: 200px;">
              <a href="${prefix}index.html" class="footer-brand">
                <i class="fa-solid fa-bolt" style="color:var(--color-primary);"></i>
                <span>Pixiva</span>
              </a>
              <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.6; margin-top:8px;">
                All utility calculations and conversions occur purely inside your local browser sandbox. Complete privacy assured.
              </p>
              <a href="https://github.com/" target="_blank" class="footer-link" style="margin-top: 12px; font-size: 0.72rem;">
                <i class="fa-brands fa-github"></i> ⭐ Open Source Components
              </a>
            </div>
            
            <div class="footer-column">
              <h4>Graphics & Icons</h4>
              <a href="${prefix}image-compressor/" class="footer-link">Image Compressor</a>
              <a href="${prefix}image-resizer/" class="footer-link">Image Resizer</a>
              <a href="${prefix}image-blur/" class="footer-link">Focal Blur Editor</a>
              <a href="${prefix}color-picker/" class="footer-link">Color Picker</a>
              <a href="${prefix}favicon-generator/" class="footer-link">Favicon Generator</a>
            </div>

            <div class="footer-column">
              <h4>Converters</h4>
              <a href="${prefix}webp-to-png/" class="footer-link">WebP → PNG</a>
              <a href="${prefix}png-to-webp/" class="footer-link">PNG → WebP</a>
              <a href="${prefix}heic-to-jpg/" class="footer-link">HEIC → JPG</a>
              <a href="${prefix}jpg-to-png/" class="footer-link">JPG → PNG</a>
              <a href="${prefix}png-to-jpg/" class="footer-link">PNG → JPG</a>
              <a href="${prefix}webp-to-jpg/" class="footer-link">WebP → JPG</a>
            </div>

            <div class="footer-column">
              <h4>Dev Utilities</h4>
              <a href="${prefix}json-formatter/" class="footer-link">JSON Formatter</a>
              <a href="${prefix}jwt-decoder/" class="footer-link">JWT Decoder</a>
              <a href="${prefix}markdown-editor/" class="footer-link">Markdown Editor</a>
              <a href="${prefix}qr-toolkit/" class="footer-link">QR Toolkit</a>
              <a href="${prefix}text-cleaner/" class="footer-link">Text Cleaner</a>
              <a href="${prefix}timestamp-converter/" class="footer-link">Timestamp Conv</a>
              <a href="${prefix}unit-converter/" class="footer-link">Unit Converter</a>
            </div>

            <div class="footer-column" style="min-width: 120px;">
              <h4>Resources</h4>
              <a href="${prefix}compare/webp-vs-png/" class="footer-link">Compare Formats</a>
              <a href="${prefix}about/" class="footer-link">About Pixiva</a>
              <a href="${prefix}contact/" class="footer-link">Contact</a>
              <a href="${prefix}privacy/" class="footer-link">Privacy Policy</a>
              <a href="${prefix}terms/" class="footer-link">Terms of Service</a>
            </div>
          </div>
          
          <div class="footer-row" style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 15px;">
            <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.6;">
              <strong style="color: #fff; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Supported File Engines</strong>
              PNG • JPG • JPEG • WebP • AVIF • HEIC • SVG • ICO • JSON • JWT • Markdown • QR
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2026 Pixiva. Offline-first local execution.</span>
            <span>Zero-server privacy assurance</span>
          </div>
        </footer>`;
}

function updateLayouts() {
  const htmlFiles = getFilesRecursively(WORKSPACE_DIR);
  console.log(`\n🔍 Found ${htmlFiles.length} HTML files to update.`);

  htmlFiles.forEach(filePath => {
    const relative = path.relative(WORKSPACE_DIR, filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    const prefix = getPrefix(filePath);
    const newSidebar = generateSidebar(filePath, prefix);
    const newFooter = generateFooter(prefix);

    // Replace <nav class="sidebar-nav">...</nav>
    const navStart = content.indexOf('<nav class="sidebar-nav"');
    const navEnd = content.indexOf('</nav>', navStart);
    if (navStart !== -1 && navEnd !== -1) {
      content = content.slice(0, navStart) + newSidebar + content.slice(navEnd + 6);
    }

    // Replace <footer class="app-footer">...</footer>
    const footerStart = content.indexOf('<footer class="app-footer"');
    const footerEnd = content.indexOf('</footer>', footerStart);
    if (footerStart !== -1 && footerEnd !== -1) {
      content = content.slice(0, footerStart) + newFooter + content.slice(footerEnd + 9);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated layout bindings: ${relative}`);
  });

  console.log(`\n🎉 Layout elements updated successfully.`);
}

updateLayouts();
