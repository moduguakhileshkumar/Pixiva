const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');

const CONVERTERS = {
  'png-to-webp': {
    title: 'Convert PNG to WebP Online - Speed Up Your Website | Pixiva',
    description: 'Convert standard PNG images into optimized, lightweight WebP files locally in your web browser. 100% private, free, batch conversion supported.',
    keywords: 'png to webp, convert png, free png to webp converter, compress png to webp, local image converter',
    inputName: 'PNG',
    outputName: 'WebP',
    accept: '.png',
    targetValue: 'webp',
    inputFormatLabel: 'PNG format',
    heroTitle: 'Convert PNG to WebP',
    heroSubtitle: 'Optimize your site speed by converting heavy PNGs to modern WebP formats in browser memory. 100% secure, zero file uploads.',
    seoTitle: 'Everything about converting PNG to WebP',
    seoIntro: 'PNG (Portable Network Graphics) is a fantastic, lossless format that preserves every detail of an image. However, it leads to heavy file sizes, causing slow website loads. WebP uses superior compression parameters, saving up to 70% of file size while preserving pixel-perfect transparency.',
    faq1Q: 'Will converting PNG to WebP break transparency?',
    faq1A: 'No. Unlike JPEG which replaces transparent zones with solid black or white, WebP has native alpha transparency support. Your transparent PNG backgrounds will remain perfectly transparent in WebP format.',
    faq2Q: 'Why is client-side conversion better?',
    faq2A: 'It is both faster and more secure. There is no waiting for file uploads or downloads. Your files are converted instantly on your local computer using browser canvas APIs.'
  },
  'heic-to-jpg': {
    title: 'Convert HEIC to JPG Online - Free iPhone Photo Converter | Pixiva',
    description: 'Convert Apple HEIC photos from iPhone to standard JPEGs locally in your web browser. 100% secure, free, batch conversion supported.',
    keywords: 'heic to jpg, convert heic, heic converter, iphone photo to jpg, local heic to jpg',
    inputName: 'HEIC',
    outputName: 'JPG',
    accept: '.heic,.heif',
    targetValue: 'jpeg',
    inputFormatLabel: 'HEIC format',
    heroTitle: 'Convert HEIC to JPG',
    heroSubtitle: 'Decode iPhone HEIC/HEIF photos and convert them to standard universally-compatible JPEGs locally in browser memory.',
    seoTitle: 'Everything about converting HEIC to JPG',
    seoIntro: 'HEIC is the default image format used by Apple on iOS devices to save space. However, Windows, Android, and many desktop editors do not support HEIC file displays. Converting them to JPEGs makes them readable on all platforms.',
    faq1Q: 'Can I convert iPhone HEIC photos to JPG?',
    faq1A: 'Yes, absolutely. Pixiva natively decodes raw Apple HEIC camera blobs using a local decoder script inside your browser. It formats them to standard JPG/JPEG images which are readable on all systems.',
    faq2Q: 'Will my HEIC metadata be kept?',
    faq2A: 'Because conversion is performed using canvas image rasterization client-side, embedded EXIF metadata (like GPS or camera settings) is stripped to protect your privacy and reduce file size.'
  },
  'avif-to-png': {
    title: 'Convert AVIF to PNG Online - Free & Private | Pixiva',
    description: 'Convert AVIF images to transparent PNG files locally in your web browser. 100% secure, free, batch conversion supported.',
    keywords: 'avif to png, convert avif, free avif to png converter, avif image converter, local image converter',
    inputName: 'AVIF',
    outputName: 'PNG',
    accept: '.avif',
    targetValue: 'png',
    inputFormatLabel: 'AVIF format',
    heroTitle: 'Convert AVIF to PNG',
    heroSubtitle: 'Convert next-gen AVIF images back into lossless, universally-compatible PNG files locally in browser memory.',
    seoTitle: 'Everything about converting AVIF to PNG',
    seoIntro: 'AVIF is a high-compression image format, but it lacks support in older operating systems, email clients, and image viewers. Converting AVIF to PNG yields a lossless, compatible image with all alpha transparency channels preserved.',
    faq1Q: 'Why should I convert AVIF to PNG?',
    faq1A: 'AVIF is a modern high-compression image format, but it is not supported in legacy web browsers, image editors, or older operating systems. Converting AVIF to PNG yields a lossless, universally compatible image.',
    faq2Q: 'Is my image quality preserved?',
    faq2A: 'Yes, converting AVIF to PNG uses lossless canvas rendering. The output PNG file preserves the original colors and transparency without adding compression artifacts.'
  },
  'svg-to-png': {
    title: 'Convert SVG to PNG Online - Free, Local & Private | Pixiva',
    description: 'Convert vector SVG files to transparent PNG images locally in your web browser. 100% secure, free, batch conversion supported.',
    keywords: 'svg to png, convert svg, free svg to png converter, vector to png, local image converter',
    inputName: 'SVG',
    outputName: 'PNG',
    accept: '.svg',
    targetValue: 'png',
    inputFormatLabel: 'SVG format',
    heroTitle: 'Convert SVG to PNG',
    heroSubtitle: 'Render vector SVG paths onto high-res transparent PNG files locally in browser memory. 100% secure.',
    seoTitle: 'Everything about converting SVG to PNG',
    seoIntro: 'SVG (Scalable Vector Graphics) is built with math paths, making it infinitely scalable. However, browsers and design editors sometimes require rasterized transparent PNGs for presentation decks or social media shares.',
    faq1Q: 'Can I convert vector SVGs to transparent PNGs?',
    faq1A: 'Yes. Pixiva scales the vector paths onto an HTML Canvas at their original dimensions and saves them as lossless PNG images with alpha channel transparency preserved.',
    faq2Q: 'Will custom fonts in my SVG render correctly?',
    faq2A: 'If your SVG relies on custom external web fonts that are not installed on your system or loaded in your browser, the canvas may render them with standard fallback fonts.'
  },
  'png-to-ico': {
    title: 'Convert PNG to ICO favicon Online - Free & Private | Pixiva',
    description: 'Convert standard PNG images into Windows ICO favicon files locally in your browser. 100% secure, free, batch conversion supported.',
    keywords: 'png to ico, convert png, free png to ico converter, favicon generator, local icon converter',
    inputName: 'PNG',
    outputName: 'ICO',
    accept: '.png',
    targetValue: 'ico',
    inputFormatLabel: 'PNG format',
    heroTitle: 'Convert PNG to ICO favicon',
    heroSubtitle: 'Generate 32x32 pixel Windows favicons and icon packs from transparent PNG files locally in browser memory.',
    seoTitle: 'Everything about converting PNG to ICO',
    seoIntro: 'ICO files are standard icon container files used by web browsers and operating systems to render site favicons. Creating a favicon from a transparent PNG makes your web platform immediately recognizable.',
    faq1Q: 'What size should my PNG be for ICO favicon conversion?',
    faq1A: 'We recommend a square PNG (such as 32x32, 48x48, or 64x64 pixels). Pixiva automatically scales and packages the PNG into a standard 32x32 pixel ICO favicon header.',
    faq2Q: 'Does the generated ICO support transparency?',
    faq2A: 'Yes, the ICO encoder packages the PNG with all alpha channel transparency settings intact, making it perfect for web favicons.'
  }
};

function generateHtml(folder, data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Metadata -->
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  <meta name="keywords" content="${data.keywords}">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="hMkvLYmRffI9Dj-gbPiLgS6iQeeUMunP_2vUq1-uCRQ" />

  <link rel="icon" type="image/png" href="https://img.icons8.com/neon/96/000000/wrench.png">
  <link rel="manifest" href="../manifest.json">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://pixiva.pages.dev/${folder}/#webapp",
        "url": "https://pixiva.pages.dev/${folder}/",
        "name": "${data.heroTitle} Offline Converter",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript",
        "description": "${data.description}",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://pixiva.pages.dev/${folder}/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Pixiva",
            "item": "https://pixiva.pages.dev/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "${data.inputName} to ${data.outputName}",
            "item": "https://pixiva.pages.dev/${folder}/"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://pixiva.pages.dev/${folder}/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "${data.faq1Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${data.faq1A}"
            }
          },
          {
            "@type": "Question",
            "name": "${data.faq2Q}",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "${data.faq2A}"
            }
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>

  <div class="app-container">
    
    <!-- Sidebar Navigation -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="../index.html" class="logo">
          <i class="fa-solid fa-bolt"></i>
          <span>Pixiva</span>
        </a>
      </div>
      
      <nav class="sidebar-nav">
        <!-- Favorites dynamic section -->
        <div id="favorites-nav-section" style="display: none;"></div>

        <div class="nav-section-title">Workspace Tools</div>
        <a href="../image-compressor/" class="nav-link">
          <i class="fa-solid fa-minimize"></i>
          <span>Image Compressor</span>
        </a>
        <a href="../image-resizer/" class="nav-link">
          <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
          <span>Image Resizer</span>
        </a>
        
        <div class="nav-section-title">Converters</div>
        <a href="../webp-to-png/" class="nav-link ${folder === 'webp-to-png' ? 'active' : ''}"><span>WebP → PNG</span></a>
        <a href="../png-to-webp/" class="nav-link ${folder === 'png-to-webp' ? 'active' : ''}"><span>PNG → WebP</span></a>
        <a href="../heic-to-jpg/" class="nav-link ${folder === 'heic-to-jpg' ? 'active' : ''}"><span>HEIC → JPG</span></a>
        <a href="../avif-to-png/" class="nav-link ${folder === 'avif-to-png' ? 'active' : ''}"><span>AVIF → PNG</span></a>
        <a href="../svg-to-png/" class="nav-link ${folder === 'svg-to-png' ? 'active' : ''}"><span>SVG → PNG</span></a>
        <a href="../png-to-ico/" class="nav-link ${folder === 'png-to-ico' ? 'active' : ''}"><span>PNG → ICO</span></a>
      </nav>
      
      <div class="media-shelf">
        <div class="shelf-title">
          <span>Local Media Shelf</span>
          <span class="shelf-clear" id="shelf-clear" title="Clear Shelf"><i class="fa-solid fa-trash-can"></i></span>
        </div>
        <div class="shelf-items" id="shelf-items">
          <div class="shelf-empty-hint">No uploads yet</div>
        </div>
      </div>

      <div class="sidebar-footer">
        <span>Pixiva v1.0.0</span>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <header class="top-nav">
        <div class="breadcrumb">
          <a href="../index.html">Pixiva</a>
          <span class="breadcrumb-sep">/</span>
          <span>${data.inputName} to ${data.outputName}</span>
          <button class="btn-fav-star" onclick="toggleFavorite('${folder}', this)" title="Toggle Favorite" style="margin-left: 8px;"><i class="fa-solid fa-star"></i></button>
        </div>
        <div class="top-actions">
          <button class="btn-command-palette-trigger" id="palette-trigger">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Search utilities</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
      </header>

      <div class="content-body">
        
        <section class="hero">
          <h1 class="hero-title">${data.heroTitle}</h1>
          <p class="hero-subtitle">${data.heroSubtitle}</p>
          <div class="privacy-badge">
            <i class="fa-solid fa-shield-halved"></i> 100% Client-Side
          </div>
          
          <div class="social-proof-badges" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
            <span class="proof-badge" style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> 100% Private
            </span>
            <span class="proof-badge" style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> No Upload Limits
            </span>
            <span class="proof-badge" style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> Works Offline
            </span>
            <span class="proof-badge" style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-circle-check" style="color: var(--color-success);"></i> Free Forever
            </span>
          </div>
        </section>

        <!-- Dropzone -->
        <div class="workspace-dropzone" id="converter-dropzone" style="cursor: default;">
          <div class="dropzone-icon-wrapper">
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
          </div>
          <h2>Drag & drop your ${data.inputName} files or <a href="javascript:void(0);" onclick="document.getElementById('converter-file-input').click();" style="color: var(--color-primary); text-decoration: underline;">Browse Files</a></h2>
          <p>Press <kbd>Ctrl + V</kbd> to paste a screenshot directly</p>
          <input type="file" id="converter-file-input" style="display: none;" accept="${data.accept}" multiple>
        </div>

        <!-- Compatibility Status Bar -->
        <div class="compatibility-status-bar" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 600px; margin: 24px auto; background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px;">
          <div style="text-align: center; border-right: 1px solid var(--border-color);">
            <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Supports</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-top: 4px;">${data.inputFormatLabel}</div>
          </div>
          <div style="text-align: center; border-right: 1px solid var(--border-color);">
            <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Operations</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-success); margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> 100% Offline</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Privacy</div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-success); margin-top: 4px;"><i class="fa-solid fa-shield-halved"></i> No Uploads</div>
          </div>
        </div>

        <!-- Active Workspace -->
        <section class="active-workspace" id="active-workspace">
          <div class="panel">
            <h2 class="panel-title"><i class="fa-solid fa-gears"></i> Batch Operations Queue</h2>
            
            <div class="form-group" style="display: none;">
              <!-- Hidden or hardcoded target select for presets -->
              <input type="hidden" id="converter-target-format" value="${data.targetValue}">
            </div>

            <div class="batch-list" id="batch-list">
              <!-- Rendered in JS -->
            </div>

            <div class="form-group" style="margin-top: 20px;">
              <button class="btn btn-primary" id="btn-convert-all" style="width: 100%;">
                <i class="fa-solid fa-gears"></i> Convert All & Save
              </button>
            </div>
          </div>
        </section>

        <!-- Tool workspace footer ad -->
        <div class="ad-placeholder"></div>

        <!-- SEO Article & Guide -->
        <section class="faq-section" style="margin-top: 60px;">
          <h2 class="faq-title" style="text-align: left; margin-bottom: 20px;">${data.seoTitle}</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
            ${data.seoIntro}
          </p>

          <h3 style="font-size: 1.2rem; font-family: var(--font-title); margin-bottom: 12px;">${data.inputName} vs ${data.outputName}: What is the difference?</h3>
          <div class="batch-list" style="margin-bottom: 30px;">
            <div class="pipeline-step-item">
              <span><strong>${data.inputName}:</strong> Optimized for specific file properties client side.</span>
            </div>
            <div class="pipeline-step-item">
              <span><strong>${data.outputName}:</strong> Lossless target formats operating directly in browser cache.</span>
            </div>
          </div>

          <h2 class="faq-title">Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-card">
              <div class="faq-header">
                <span>${data.faq1Q}</span>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
              <div class="faq-body">
                <div class="faq-content">
                  ${data.faq1A}
                </div>
              </div>
            </div>

            <div class="faq-card">
              <div class="faq-header">
                <span>${data.faq2Q}</span>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
              <div class="faq-body">
                <div class="faq-content">
                  ${data.faq2A}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom Page Ad Slot -->
        <div class="ad-placeholder"></div>

        <!-- Unified Footer -->
        <footer class="app-footer">
          <div class="footer-row">
            <div class="footer-column" style="flex: 2; min-width: 250px;">
              <a href="../index.html" class="footer-brand">
                <i class="fa-solid fa-bolt" style="color:var(--color-primary);"></i>
                <span>Pixiva</span>
              </a>
              <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.6; margin-top:8px;">
                All image processing happens locally in your browser. No uploads, no tracking of your files, no servers involved.
              </p>
              <a href="https://github.com/" target="_blank" class="footer-link" style="margin-top: 12px; font-size: 0.78rem;">
                <i class="fa-brands fa-github"></i> ⭐ Open Source Components
              </a>
            </div>
            <div class="footer-column">
              <h4>Workspace</h4>
              <a href="../image-compressor/" class="footer-link">Image Compressor</a>
              <a href="../image-resizer/" class="footer-link">Image Resizer</a>
            </div>
            <div class="footer-column">
              <h4>Converters</h4>
              <a href="../webp-to-png/" class="footer-link">WebP → PNG</a>
              <a href="../png-to-webp/" class="footer-link">PNG → WebP</a>
              <a href="../heic-to-jpg/" class="footer-link">HEIC → JPG</a>
              <a href="../avif-to-png/" class="footer-link">AVIF → PNG</a>
            </div>
            <div class="footer-column">
              <h4>Resources</h4>
              <a href="../compare/webp-vs-png/" class="footer-link">Compare Formats</a>
              <a href="../privacy/" class="footer-link">Privacy Policy</a>
              <a href="../terms/" class="footer-link">Terms of Service</a>
              <a href="../contact/" class="footer-link">Contact</a>
            </div>
          </div>
          
          <div class="footer-row" style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 10px;">
            <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.6;">
              <strong style="color: #fff; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Supported Formats</strong>
              PNG • JPG • JPEG • WebP • AVIF • HEIC • SVG • ICO
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2026 Pixiva. Offline-first local execution.</span>
            <span>Zero-server privacy assurance</span>
          </div>
        </footer>

      </div>
    </main>
  </div>

  <!-- Mobile Bottom Navigation Bar -->
  <div class="bottom-nav-bar">
    <a href="../index.html" class="bottom-nav-link" data-action="home">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
    </a>
  </div>

  <!-- Command Palette Modal -->
  <div class="command-palette-overlay" id="command-palette-overlay">
    <div class="command-palette">
      <div class="command-palette-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" class="command-palette-input" id="command-input" placeholder="Search Pixiva utilities...">
      </div>
      <div class="command-palette-results" id="command-results"></div>
    </div>
  </div>

  <!-- Scripts -->
  <script type="module" src="../js/db.js"></script>
  <script type="module" src="../js/app.js"></script>
  <script type="module">
    import { initConverter } from '../js/tools/converter.js';
    initConverter('${data.accept.split(',')[0].replace('.', '')}', '${data.targetValue}');
  </script>
</body>
</html>
`;
}

function run() {
  Object.keys(CONVERTERS).forEach(folder => {
    const data = CONVERTERS[folder];
    const html = generateHtml(folder, data);
    const folderPath = path.join(WORKSPACE_DIR, folder);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    
    const filePath = path.join(folderPath, 'index.html');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Generated: ${folder}/index.html`);
  });
  console.log(`\n🎉 All converter pages successfully re-templated!`);
}

run();
