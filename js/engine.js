// Decoupled Processing Engine (Zero DOM dependency)

// Helper to load HEIC script from CDN dynamically
function loadHeicDecoder() {
  return new Promise((resolve, reject) => {
    if (window.heic2any) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Convert File/Blob to HTML Image Element
export function fileToImage(file) {
  return new Promise(async (resolve, reject) => {
    let activeFile = file;

    // Check if HEIC photo
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';
    if (isHeic) {
      try {
        await loadHeicDecoder();
        const converted = await window.heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        });
        activeFile = Array.isArray(converted) ? converted[0] : converted;
      } catch (err) {
        return reject(new Error('HEIC decoding failed. Make sure it is a valid HEIC file.'));
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('FileReader error.'));
    reader.readAsDataURL(activeFile);
  });
}

// Draw image onto canvas with specified dimensions
export function drawCanvas(img, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

// Perform quality compression on canvas
export function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.8) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, type, quality);
  });
}

// Custom ICO encoder (packages PNG into an ICO file header)
export function encodePNGToICO(pngBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const pngBytes = new Uint8Array(reader.result);
      const size = pngBytes.length;
      
      // 6 bytes Header + 16 bytes Directory Entry + PNG data
      const icoBytes = new Uint8Array(22 + size);
      
      // 1. ICONDIR Header (6 bytes)
      icoBytes[0] = 0; icoBytes[1] = 0; // Reserved (always 0)
      icoBytes[2] = 1; icoBytes[3] = 0; // Resource Type (1 = Icon)
      icoBytes[4] = 1; icoBytes[5] = 0; // Image count (1 image)

      // 2. ICONDIRENTRY (16 bytes)
      icoBytes[6] = 32;                 // Width (standard 32px)
      icoBytes[7] = 32;                 // Height (standard 32px)
      icoBytes[8] = 0;                  // Color count (0 = >256 colors)
      icoBytes[9] = 0;                  // Reserved
      icoBytes[10] = 1; icoBytes[11] = 0; // Color planes (1)
      icoBytes[12] = 32; icoBytes[13] = 0; // Bits per pixel (32)
      
      // Size of image data (4 bytes, Little Endian)
      icoBytes[14] = size & 0xff;
      icoBytes[15] = (size >> 8) & 0xff;
      icoBytes[16] = (size >> 16) & 0xff;
      icoBytes[17] = (size >> 24) & 0xff;
      
      // Offset of image data (4 bytes, Little Endian - header (6) + entry (16) = 22)
      icoBytes[18] = 22;
      icoBytes[19] = 0;
      icoBytes[20] = 0;
      icoBytes[21] = 0;

      // 3. Append raw PNG bytes
      icoBytes.set(pngBytes, 22);
      
      const blob = new Blob([icoBytes], { type: 'image/x-icon' });
      resolve(blob);
    };
    reader.onerror = () => reject(new Error('ICO reader error.'));
    reader.readAsArrayBuffer(pngBlob);
  });
}
