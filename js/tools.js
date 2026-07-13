export const tools = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    title: "Compress Image Online - Reduce File Size Privately",
    description: "Shrink JPG, PNG, or WebP file sizes locally using a visual slider comparison. 100% private, no uploads.",
    category: "optimization",
    icon: "fa-minimize",
    faq: [
      { q: "Is my image uploaded to any server?", a: "No. Pixiva operates 100% locally in your browser memory. Your files are never sent to a server." },
      { q: "Will I lose image quality?", a: "Pixiva uses canvas resampling and smart variable quality compressions. You can adjust the quality slider and preview output details in real-time." }
    ]
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    title: "Resize Image Online - Scale Width and Height Locally",
    description: "Adjust image pixel dimensions with custom widths and heights, locking aspect ratio settings.",
    category: "optimization",
    icon: "fa-up-right-and-down-left-from-center",
    faq: [
      { q: "Can I resize files other than PNG?", a: "Yes. Pixiva supports resizing JPG, PNG, WebP, and AVIF image formats natively in the browser." },
      { q: "Does locking aspect ratio prevent distortion?", a: "Yes. Keeping aspect ratios locked guarantees that when you adjust width, height scales proportionally to prevent squishing." }
    ]
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG",
    title: "Convert WebP to PNG Online - Free Browser Converter",
    description: "Convert Google WebP files into transparent PNG format inside your browser. No files are uploaded.",
    category: "conversion",
    sourceFormat: "image/webp",
    targetFormat: "png",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "What is WebP?", a: "WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images." },
      { q: "Why convert WebP to PNG?", a: "While WebP is highly optimized for the web, older image editors or email systems might not support it yet. PNG is universally compatible." }
    ]
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP",
    title: "Convert PNG to WebP Online - Speed Up Your Website",
    description: "Convert PNG files to optimized WebP format client-side. Dramatically reduce loading times.",
    category: "conversion",
    sourceFormat: "image/png",
    targetFormat: "webp",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "Does WebP support transparency?", a: "Yes. WebP supports full alpha transparency just like PNG, but at a fraction of the file size." },
      { q: "How much size will I save?", a: "Converting PNG to WebP typically reduces the image file size by 30% to 70% without visible quality degradation." }
    ]
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    title: "Convert HEIC to JPG Online - Open iPhone Photos Anywhere",
    description: "Convert Apple HEIC photos to compatible JPG files instantly. Safe, fast, and local.",
    category: "conversion",
    sourceFormat: "image/heic",
    targetFormat: "jpeg",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "Why does my iPhone take HEIC photos?", a: "HEIC (High Efficiency Image Container) is Apple's default format. It saves high-quality images in roughly half the space of a JPG." },
      { q: "How do I open HEIC on Windows?", a: "Windows does not support HEIC files out-of-the-box. Converting your HEIC files to JPG is the fastest way to open them on Windows." }
    ]
  },
  {
    slug: "avif-to-png",
    name: "AVIF to PNG",
    title: "Convert AVIF to PNG Online - Free Browser Converter",
    description: "Convert next-gen AVIF images into standard PNG format. 100% client-side conversion.",
    category: "conversion",
    sourceFormat: "image/avif",
    targetFormat: "png",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "What is AVIF?", a: "AVIF is a next-generation image format based on the AV1 video codec. It offers better compression rates than WebP and PNG." },
      { q: "Why convert AVIF to PNG?", a: "AVIF is not yet fully supported by all desktop software, rendering conversions to PNG necessary for general editing." }
    ]
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG",
    title: "Convert SVG to PNG Online - Render Vectors to Pixels",
    description: "Rasterize vector SVG files into high-resolution transparent PNG images in your browser.",
    category: "conversion",
    sourceFormat: "image/svg+xml",
    targetFormat: "png",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "Will the rasterized PNG look blurry?", a: "Only if scaled beyond the rasterized canvas size. We convert vector nodes to precise raster pixels at the original dimensions." },
      { q: "Can I download it with transparency?", a: "Yes. The output PNG preserves any transparent backgrounds present in the source SVG code." }
    ]
  },
  {
    slug: "png-to-ico",
    name: "PNG to ICO",
    title: "Convert PNG to ICO Online - Generate Web Favicons",
    description: "Convert transparent PNG files into standard ICO formats for browser favicons.",
    category: "conversion",
    sourceFormat: "image/png",
    targetFormat: "ico",
    icon: "fa-arrow-right-arrow-left",
    faq: [
      { q: "What is an ICO file used for?", a: "ICO is the file format used for site favicons that display in browser tabs and bookmark bars." },
      { q: "What sizes are included?", a: "Pixiva packs standard multi-resolution blocks (16x16, 32x32) into the compiled ICO structure." }
    ]
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    title: "Image Color Picker - Extract Hex Codes Online",
    description: "Extract RGB and HEX color codes from uploaded images locally in browser memory.",
    category: "utility",
    icon: "fa-eye-dropper",
    faq: [
      { q: "Can I save colors?", a: "Yes, you can save colors to a temporary visual palette and copy them as hex strings." }
    ]
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    title: "Favicon Generator - Convert PNG to ICO Favicons",
    description: "Create ICO favicons and PWA touch icons from standard square PNG files locally.",
    category: "utility",
    icon: "fa-image",
    faq: [
      { q: "What files should I upload?", a: "A square transparent PNG (e.g. 512x512) is highly recommended for best results." }
    ]
  },
  {
    slug: "image-blur",
    name: "Focal Blur Editor",
    title: "Image Blur Editor - Reposition Focus and Blurs",
    description: "Add focal blurs and custom visual depth adjustments to images in real-time.",
    category: "utility",
    icon: "fa-eye-slash",
    faq: [
      { q: "How do I set the focus point?", a: "Simply click anywhere on the loaded image canvas to reposition the focus core." }
    ]
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    title: "Invoice Generator - Quick Free PDF Invoices",
    description: "Generate customizable PDF invoice drafts instantly without server uploads.",
    category: "utility",
    icon: "fa-file-invoice-dollar",
    faq: [
      { q: "Is this secure?", a: "Yes, your client name and financial figures are compiled purely in client memory and never uploaded." }
    ]
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    title: "JSON Formatter - Beautify and Minify JSON strings",
    description: "Format, validate, beautify, and minify raw JSON string code locally.",
    category: "developer",
    icon: "fa-code",
    faq: [
      { q: "Will this validate syntax errors?", a: "Yes, it provides immediate red error validation badges describing missing commas or brackets." }
    ]
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    title: "JWT Token Decoder - View JSON Web Token Claims",
    description: "Parse header information and payload data from JSON Web Tokens (JWT) locally.",
    category: "developer",
    icon: "fa-key",
    faq: [
      { q: "Are secret keys safe?", a: "Yes. Pixiva decodes raw base64 token blocks on your browser thread. No secrets leave your screen." }
    ]
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    title: "Markdown Editor - Live Preview & HTML Export",
    description: "Write markup files with real-time browser preview layouts and export to HTML files.",
    category: "developer",
    icon: "fa-file-pen",
    faq: [
      { q: "Can I download the HTML?", a: "Yes, click 'Save HTML' to download the compiled HTML page instantly." }
    ]
  },
  {
    slug: "qr-toolkit",
    name: "QR Code Toolkit",
    title: "QR Code Generator - Convert Text or URLs to QRs",
    description: "Generate custom dot color QR code graphics and download images locally.",
    category: "utility",
    icon: "fa-qrcode",
    faq: [
      { q: "Can I change the color?", a: "Yes, pick any hex color to match your branding dots." }
    ]
  },
  {
    slug: "text-cleaner",
    name: "Text Cleaner & Case Converter",
    title: "Text Cleaner - UPPERCASE, lowercase, Trim & Strip",
    description: "Convert string cases, trim spaces, and strip HTML tags client-side.",
    category: "text",
    icon: "fa-wand-magic-sparkles",
    faq: [
      { q: "Does it support tag stripping?", a: "Yes, it strips all standard XML/HTML brackets and elements instantly." }
    ]
  },
  {
    slug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    title: "Unix Timestamp Converter - Convert Epoch to Date",
    description: "Convert timestamps to UTC/ISO date structures and back in browser cache.",
    category: "developer",
    icon: "fa-calendar-days",
    faq: [
      { q: "What unit is supported?", a: "It converts standard 10-digit Unix timestamps (in seconds)." }
    ]
  },
  {
    slug: "unit-converter",
    name: "Universal Unit Converter",
    title: "Universal Unit Converter - Convert Metric and Imperial",
    description: "Calculate measurements and dimension conversions for lengths and weights locally.",
    category: "developer",
    icon: "fa-scale-balanced",
    faq: [
      { q: "What units are supported?", a: "Length (m, km, ft, in), Weight (kg, g, lb, oz), and Temp (C, F, K)." }
    ]
  }
];
