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
  }
];
