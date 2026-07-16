const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');

const UTILITIES = {
  'color-picker': {
    title: 'Image Color Picker Online - Extract Colors from Photos | Pixiva',
    description: 'Upload an image and click anywhere to pick, extract, and save colors locally. Supports HEX and RGB formats. 100% private.',
    keywords: 'color picker, image color picker, pick color from image, hex color finder, local color picker',
    heroTitle: 'Image Color Picker',
    heroSubtitle: 'Upload any graphic or photograph and click to extract and save hex codes locally in your browser memory.',
    jsFile: 'colorPicker.js',
    jsInitFunc: 'initColorPicker',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-eye-dropper"></i> Upload Image to Pick Colors</h2>
          <div class="workspace-dropzone" id="picker-dropzone" style="cursor: pointer; margin-bottom: 20px;">
            <div class="dropzone-icon-wrapper"><i class="fa-solid fa-image"></i></div>
            <h2>Drag or Click to load image</h2>
            <input type="file" id="picker-file-input" style="display: none;" accept="image/*">
          </div>
          
          <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
            <canvas id="canvas-picker" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #000; cursor: crosshair; display: block;"></canvas>
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 16px;">
              <div class="stat-prominent-box" style="display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <div id="color-cursor-prev" style="width: 48px; height: 48px; border-radius: var(--radius-sm); border: 2px solid #fff; background: #000;"></div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Hovered Color</div>
                  <div id="color-cursor-hex" style="font-weight: 700; color: #fff; font-family: monospace;">#000000</div>
                  <div id="color-cursor-rgb" style="font-size: 0.75rem; color: var(--text-secondary); font-family: monospace;">rgb(0, 0, 0)</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Active Color Hex</label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" id="active-hex-input" class="form-control" readonly style="background:#000; color:#fff; font-family: monospace;" value="#000000">
                  <button class="btn btn-secondary" id="btn-copy-hex"><i class="fa-solid fa-copy"></i></button>
                </div>
              </div>

              <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" id="btn-add-to-palette" style="flex: 1;"><i class="fa-solid fa-plus"></i> Save Color</button>
                <button class="btn btn-secondary" id="btn-clear-palette"><i class="fa-solid fa-trash"></i> Clear</button>
              </div>

              <div>
                <h4 style="font-family: var(--font-title); color: #fff; margin-bottom: 8px; font-size: 0.88rem;">Palette Display</h4>
                <div id="palette-display-container" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
              </div>
            </div>
          </div>
        </div>
    `
  },
  'favicon-generator': {
    title: 'Favicon Generator Online - Create Web Favicons Locally | Pixiva',
    description: 'Convert transparent PNG images to Windows standard ICO favicons and PWA touch icons. 100% private, free.',
    keywords: 'favicon generator, generate favicon, png to favicon, favicon creator, local icon creator',
    heroTitle: 'Favicon Generator',
    heroSubtitle: 'Rasterize standard favicon dimensions (16x16, 32x32, 192x192, 512x512) from transparent PNG structures.',
    jsFile: 'faviconGenerator.js',
    jsInitFunc: 'initFaviconGenerator',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-image"></i> Generate Favicon Pack</h2>
          <div class="workspace-dropzone" id="favicon-dropzone" style="cursor: pointer; margin-bottom: 20px;">
            <div class="dropzone-icon-wrapper"><i class="fa-solid fa-upload"></i></div>
            <h2>Upload square PNG to generate favicons</h2>
            <input type="file" id="favicon-file-input" style="display: none;" accept="image/png">
          </div>
          
          <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
            <canvas id="canvas-favicon-source" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #000; display: block;"></canvas>
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 12px;">
              <button class="btn btn-primary" id="btn-dl-fav16"><i class="fa-solid fa-download"></i> Download 16x16 Favicon</button>
              <button class="btn btn-primary" id="btn-dl-fav32"><i class="fa-solid fa-download"></i> Download 32x32 Favicon</button>
              <button class="btn btn-primary" id="btn-dl-fav192"><i class="fa-solid fa-download"></i> Download 192x192 Icon</button>
              <button class="btn btn-primary" id="btn-dl-fav512"><i class="fa-solid fa-download"></i> Download 512x512 Icon</button>
            </div>
          </div>
        </div>
    `
  },
  'image-blur': {
    title: 'Focal Blur Photo Editor Online - Blur Image Sections | Pixiva',
    description: 'Blur photo boundaries and create focal depth effects locally inside your browser. 100% private, free.',
    keywords: 'image blur, blur photo, focal depth blur, blur image online, local photo blur editor',
    heroTitle: 'Focal Blur Photo Editor',
    heroSubtitle: 'Configure focal circles and blur surrounding pixels locally using canvas math controls.',
    jsFile: 'imageBlur.js',
    jsInitFunc: 'initImageBlur',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-eye-slash"></i> Focal Blur Editor</h2>
          <div class="workspace-dropzone" id="blur-dropzone" style="cursor: pointer; margin-bottom: 20px;">
            <div class="dropzone-icon-wrapper"><i class="fa-solid fa-image"></i></div>
            <h2>Upload photo to blur</h2>
            <input type="file" id="blur-file-input" style="display: none;" accept="image/*">
          </div>
          
          <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
            <canvas id="canvas-blur-render" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #000; cursor: crosshair; display: block;"></canvas>
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 16px;">
              <div class="slider-group">
                <div class="slider-header">
                  <span class="form-label">Blur Radius</span>
                  <span class="slider-val" id="blur-radius-val">10px</span>
                </div>
                <input type="range" id="blur-range" min="0" max="50" value="10">
              </div>

              <div class="slider-group">
                <div class="slider-header">
                  <span class="form-label">Focus Core Radius</span>
                </div>
                <input type="range" id="blur-focus-radius" min="10" max="300" value="100">
              </div>

              <button class="btn btn-primary" id="btn-download-blur" style="width: 100%;"><i class="fa-solid fa-download"></i> Download Blurred Photo</button>
            </div>
          </div>
        </div>
    `
  },
  'invoice-generator': {
    title: 'Invoice Generator Online - Free Invoice PDF Creator | Pixiva',
    description: 'Generate standard PDF invoices locally in your web browser. Fill in details and download PDFs. 100% private, free.',
    keywords: 'invoice generator, create invoice, free invoice PDF creator, local invoice builder, private invoice',
    heroTitle: 'Quick Invoice Creator',
    heroSubtitle: 'Build and compile downloadable PDF invoices in browser cache memory without server inputs.',
    jsFile: 'invoiceGenerator.js',
    jsInitFunc: 'initInvoiceGenerator',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-file-invoice-dollar"></i> Quick Invoice Creator</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Bill To (Client)</label>
                <input type="text" id="invoice-client" class="form-control" placeholder="Company Name" style="background:#000; color:#fff;">
              </div>
              <div class="form-group">
                <label class="form-label">Invoice Number</label>
                <input type="text" id="invoice-num" class="form-control" placeholder="INV-001" style="background:#000; color:#fff;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Item Description</label>
                <input type="text" id="invoice-item-desc" class="form-control" placeholder="Consulting Services" style="background:#000; color:#fff;">
              </div>
              <div class="form-group">
                <label class="form-label">Rate</label>
                <input type="number" id="invoice-item-rate" class="form-control" placeholder="100" style="background:#000; color:#fff;">
              </div>
              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input type="number" id="invoice-item-qty" class="form-control" placeholder="10" style="background:#000; color:#fff;">
              </div>
            </div>

            <button class="btn btn-primary" id="btn-generate-invoice" style="width: 100%;"><i class="fa-solid fa-file-pdf"></i> Generate PDF Invoice</button>
          </div>
        </div>
    `
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator Online - Beautify and Minify JSON | Pixiva',
    description: 'Format, validate, beautify, and minify raw JSON string code locally in your browser. 100% private, free.',
    keywords: 'json formatter, json validator, beautify json, minify json, local json parser',
    heroTitle: 'JSON Formatter & Validator',
    heroSubtitle: 'Parse and validate JSON objects instantly with dynamic syntax warning highlights.',
    jsFile: 'jsonFormatter.js',
    jsInitFunc: 'initJsonFormatter',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-code"></i> JSON Formatter & Validator</h2>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button class="btn btn-secondary" id="btn-json-fmt2">Beautify (2 Spaces)</button>
            <button class="btn btn-secondary" id="btn-json-fmt4">Beautify (4 Spaces)</button>
            <button class="btn btn-secondary" id="btn-json-minify">Minify</button>
            <button class="btn btn-secondary" id="btn-json-clear">Clear</button>
            <button class="btn btn-primary" id="btn-copy-json" style="margin-left: auto;"><i class="fa-solid fa-copy"></i> Copy Output</button>
          </div>
          
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <label class="form-label" style="margin-bottom: 0;">Input Raw JSON</label>
                <div id="json-valid-badge" class="validation-badge" style="display: none;"></div>
              </div>
              <textarea id="json-input" class="form-control" rows="15" placeholder='Paste JSON code here e.g. {"name":"Pixiva","active":true}' style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
            
            <div style="flex: 1; min-width: 250px;">
              <label class="form-label">Formatted Output</label>
              <textarea id="json-output" class="form-control" rows="15" readonly placeholder="Output will appear here..." style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
          </div>
        </div>
    `
  },
  'jwt-decoder': {
    title: 'JWT Decoder Online - Decode JSON Web Tokens Privately | Pixiva',
    description: 'Decode encoded JSON Web Tokens (JWT) locally to view the header, payload, and signatures. 100% private, free.',
    keywords: 'jwt decoder, decode jwt, json web token decoder, local jwt parser, parse jwt',
    heroTitle: 'JWT Token Decoder',
    heroSubtitle: 'Extract client-side token structures (Headers and Payload contents) without server requests.',
    jsFile: 'jwtDecoder.js',
    jsInitFunc: 'initJwtDecoder',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-key"></i> JWT Token Decoder</h2>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 12px;">
              <label class="form-label">Paste Encoded Token (JWT)</label>
              <textarea id="jwt-input" class="form-control" rows="15" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 12px;">
              <label class="form-label">Header (Decoded)</label>
              <textarea id="jwt-header-output" class="form-control" rows="5" readonly placeholder="Header info..." style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
              
              <label class="form-label">Payload (Decoded)</label>
              <textarea id="jwt-payload-output" class="form-control" rows="8" readonly placeholder="Payload info..." style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
          </div>
        </div>
    `
  },
  'markdown-editor': {
    title: 'Markdown Editor & Previewer Online - HTML Compiler | Pixiva',
    description: 'Edit, write, and preview markdown code strings locally and download compiled HTML templates. 100% private, free.',
    keywords: 'markdown editor, markdown previewer, convert markdown to html, local markdown compiler',
    heroTitle: 'Real-Time Markdown Editor',
    heroSubtitle: 'Translate markup text into structured HTML previews instantly using browser threads.',
    jsFile: 'markdownEditor.js',
    jsInitFunc: 'initMarkdownEditor',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-file-pen"></i> Real-Time Markdown Editor</h2>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button class="btn btn-secondary" id="btn-md-clear">Clear</button>
            <button class="btn btn-primary" id="btn-md-dl-html" style="margin-left: auto;"><i class="fa-solid fa-download"></i> Save HTML</button>
          </div>
          
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
              <label class="form-label">Editor (Markdown syntax)</label>
              <textarea id="md-input" class="form-control" rows="18" placeholder="# Hello Pixiva&#10;&#10;Write **markdown** elements here..." style="background:#000; color:#fff; font-family: monospace; resize: vertical;"></textarea>
            </div>
            
            <div style="flex: 1; min-width: 250px;">
              <label class="form-label">Live Preview</label>
              <div id="md-preview" style="height: 380px; overflow-y: auto; background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px; color: #fff;"></div>
            </div>
          </div>
        </div>
    `
  },
  'qr-toolkit': {
    title: 'QR Code Generator Online - Custom QR Creator | Pixiva',
    description: 'Generate custom QR codes from text or web URLs locally. Configure dot colors and download QR images. 100% private, free.',
    keywords: 'qr code generator, qr generator, custom qr code creator, local qr builder, generate qr',
    heroTitle: 'QR Code Toolkit',
    heroSubtitle: 'Build downloadable custom QR graphics locally in browser memory without sending data to servers.',
    jsFile: 'qrToolkit.js',
    jsInitFunc: 'initQrToolkit',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-qrcode"></i> QR Code Toolkit</h2>
          <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Enter Text or URL</label>
                <input type="text" id="qr-text-input" class="form-control" value="https://pixiva.pages.dev" style="background:#000; color:#fff;">
              </div>
              
              <div class="form-group">
                <label class="form-label">Dot Color</label>
                <input type="color" id="qr-color-dark" class="form-control" value="#7c3aed" style="background:#000; height: 40px; padding: 4px;">
              </div>

              <button class="btn btn-primary" id="btn-generate-qr" style="width: 100%;"><i class="fa-solid fa-arrows-rotate"></i> Generate QR Code</button>
            </div>
            
            <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
              <div id="qr-canvas-container" style="background:#fff; padding: 16px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; width: 200px; height: 200px; border: 1px solid var(--border-color);">
                <!-- Appends canvas in JS -->
              </div>
              <button class="btn btn-secondary" id="btn-download-qr" style="width: 200px;"><i class="fa-solid fa-download"></i> Save QR Image</button>
            </div>
          </div>
        </div>
    `
  },
  'text-cleaner': {
    title: 'Text Cleaner & Case Converter Online - Strip Tags & Trim | Pixiva',
    description: 'Convert text to UPPERCASE, lowercase, trim whitespace, and strip HTML tags locally in your browser. 100% private, free.',
    keywords: 'text cleaner, case converter, trim text, strip html tags, local text editor',
    heroTitle: 'Text Cleaner & Case Converter',
    heroSubtitle: 'Sanitize strings, convert character cases, and strip tag blocks dynamically on the client-side.',
    jsFile: 'textCleaner.js',
    jsInitFunc: 'initTextCleaner',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Text Cleaner & Case Converter</h2>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            <button class="btn btn-secondary" id="btn-text-upper">UPPERCASE</button>
            <button class="btn btn-secondary" id="btn-text-lower">lowercase</button>
            <button class="btn btn-secondary" id="btn-text-trim">Trim Whitespace</button>
            <button class="btn btn-secondary" id="btn-text-strip-tags">Strip HTML Tags</button>
            <button class="btn btn-secondary" id="btn-text-clear">Clear</button>
            <button class="btn btn-primary" id="btn-copy-text" style="margin-left: auto;"><i class="fa-solid fa-copy"></i> Copy Output</button>
          </div>
          
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
              <label class="form-label">Input Text</label>
              <textarea id="text-input" class="form-control" rows="15" placeholder="Type or paste your text here..." style="background:#000; color:#fff; resize: vertical;"></textarea>
            </div>
            
            <div style="flex: 1; min-width: 250px;">
              <label class="form-label">Output Text</label>
              <textarea id="text-output" class="form-control" rows="15" readonly placeholder="Output will appear here..." style="background:#000; color:#fff; resize: vertical;"></textarea>
            </div>
          </div>
        </div>
    `
  },
  'timestamp-converter': {
    title: 'Unix Timestamp Converter Online - Epoch Time Converter | Pixiva',
    description: 'Convert Unix timestamps (epoch) to readable local and UTC dates, and vice versa. 100% private, free.',
    keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp, local converter',
    heroTitle: 'Unix Timestamp Converter',
    heroSubtitle: 'Translate dates and timestamps instantly using timezone offsets in your browser cache.',
    jsFile: 'timestampConverter.js',
    jsInitFunc: 'initTimestampConverter',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-calendar-days"></i> Unix Timestamp Converter</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Unix Timestamp (Seconds)</label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" id="input-timestamp" class="form-control" style="background:#000; color:#fff;" placeholder="1710000000">
                  <button class="btn btn-secondary" id="btn-ts-to-date">Convert to Date</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Date String (UTC/ISO)</label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" id="input-datestring" class="form-control" style="background:#000; color:#fff;" placeholder="2026-07-14T03:31:00Z">
                  <button class="btn btn-secondary" id="btn-date-to-ts">Convert to Timestamp</button>
                </div>
              </div>
            </div>

            <div class="stat-prominent-grid">
              <div class="stat-prominent-box" style="flex: 1;">
                <span class="stat-prominent-label">Local Date & Time</span>
                <span class="stat-prominent-val" id="result-local-date" style="font-size: 1rem;">-</span>
              </div>
              <div class="stat-prominent-box" style="flex: 1;">
                <span class="stat-prominent-label">UTC Date & Time</span>
                <span class="stat-prominent-val" id="result-utc-date" style="font-size: 1rem;">-</span>
              </div>
              <div class="stat-prominent-box" style="flex: 1;">
                <span class="stat-prominent-label">Calculated Timestamp</span>
                <span class="stat-prominent-val" id="result-timestamp" style="font-size: 1.1rem; font-family: monospace;">-</span>
              </div>
            </div>
          </div>
        </div>
    `
  },
  'unit-converter': {
    title: 'Universal Unit Converter Online - Convert Length, Weight | Pixiva',
    description: 'Convert lengths, weights, and temperature units locally in your web browser. 100% private, free.',
    keywords: 'unit converter, length converter, weight converter, temp converter, local conversion calculator',
    heroTitle: 'Universal Unit Converter',
    heroSubtitle: 'Calculate scale transformations for metrics and imperial measurements client-side.',
    jsFile: 'unitConverter.js',
    jsInitFunc: 'initUnitConverter',
    htmlContent: `
        <div class="panel">
          <h2 class="panel-title"><i class="fa-solid fa-scale-balanced"></i> Universal Unit Converter</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Select Dimension</label>
                <select id="select-unit-type" class="form-control" style="background:#000; border-color:var(--border-color);">
                  <option value="length">Length</option>
                  <option value="weight">Weight / Mass</option>
                  <option value="temp">Temperature</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">From Unit</label>
                <select id="select-unit-from" class="form-control" style="background:#000; border-color:var(--border-color);"></select>
              </div>

              <div class="form-group">
                <label class="form-label">To Unit</label>
                <select id="select-unit-to" class="form-control" style="background:#000; border-color:var(--border-color);"></select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Input Value</label>
                <input type="number" id="input-unit-value" class="form-control" value="1" style="background:#000; color:#fff;">
              </div>
              
              <div class="form-group">
                <label class="form-label">Converted Value</label>
                <input type="text" id="output-unit-value" class="form-control" readonly style="background:#000; color:#fff; font-family: monospace;">
              </div>
            </div>
          </div>
        </div>
    `
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
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5535227871644720"
     crossorigin="anonymous"></script>

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
        "name": "${data.heroTitle}",
        "applicationCategory": "DeveloperApplication",
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
            "name": "${data.heroTitle}",
            "item": "https://pixiva.pages.dev/${folder}/"
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
        <a href="../" class="logo">
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
        <a href="../webp-to-png/" class="nav-link"><span>WebP → PNG</span></a>
        <a href="../png-to-webp/" class="nav-link"><span>PNG → WebP</span></a>
        <a href="../heic-to-jpg/" class="nav-link"><span>HEIC → JPG</span></a>
        <a href="../avif-to-png/" class="nav-link"><span>AVIF → PNG</span></a>
        <a href="../svg-to-png/" class="nav-link"><span>SVG → PNG</span></a>
        <a href="../png-to-ico/" class="nav-link"><span>PNG → ICO</span></a>
        <a href="../jpg-to-png/" class="nav-link"><span>JPG → PNG</span></a>
        <a href="../png-to-jpg/" class="nav-link"><span>PNG → JPG</span></a>
        <a href="../webp-to-jpg/" class="nav-link"><span>WebP → JPG</span></a>
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
          <a href="../">Pixiva</a>
          <span class="breadcrumb-sep">/</span>
          <span>${data.heroTitle}</span>
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

        <!-- Tool Input and Control Viewport -->
        ${data.htmlContent}

        <!-- Tool workspace footer ad -->
        <div class="ad-placeholder"></div>

        <!-- SEO Article & Guide -->
        <section class="faq-section" style="margin-top: 60px;">
          <h2 class="faq-title" style="text-align: left; margin-bottom: 20px;">Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-card">
              <div class="faq-header">
                <span>Is it safe to use this tool on Pixiva?</span>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
              <div class="faq-body">
                <div class="faq-content">
                  Yes, it is completely secure. Traditional tools process your data on remote servers, which can compromise privacy. Pixiva performs all formatting, decoding, and rendering locally in your browser memory. Your data never leaves your device.
                </div>
              </div>
            </div>

            <div class="faq-card">
              <div class="faq-header">
                <span>Can I use this tool offline?</span>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
              <div class="faq-body">
                <div class="faq-content">
                  Yes. Once the page is loaded, the service worker caches the scripts and styles locally. You can use all developer calculators, decoders, and generators offline without any internet connection.
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
              <a href="../" class="footer-brand">
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
              <a href="../jpg-to-png/" class="footer-link">JPG → PNG</a>
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
    <a href="../" class="bottom-nav-link" data-action="home">
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
    import { ${data.jsInitFunc} } from '../js/tools/${data.jsFile}';
    ${data.jsInitFunc}();
  </script>
</body>
</html>
`;
}

function run() {
  Object.keys(UTILITIES).forEach(folder => {
    const data = UTILITIES[folder];
    const html = generateHtml(folder, data);
    const folderPath = path.join(WORKSPACE_DIR, folder);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    
    const filePath = path.join(folderPath, 'index.html');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Generated Developer Utility: ${folder}/index.html`);
  });
  console.log(`\n🎉 All developer tools successfully compiled into HTML folders!`);
}

run();
