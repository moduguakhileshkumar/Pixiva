import { showToast } from '../app.js';

export function initFaviconGenerator() {
  const dropzone = document.getElementById('favicon-dropzone');
  const fileInput = document.getElementById('favicon-file-input');
  const canvasSource = document.getElementById('canvas-favicon-source');
  
  const dl16 = document.getElementById('btn-dl-fav16');
  const dl32 = document.getElementById('btn-dl-fav32');
  const dl192 = document.getElementById('btn-dl-fav192');
  const dl512 = document.getElementById('btn-dl-fav512');

  let img = null;
  const ctx = canvasSource.getContext('2d');

  // Trigger file dialog
  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.match('image.*')) {
      showToast('Please upload an image file!', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      img = new Image();
      img.onload = () => {
        // Source canvas is scaled for display
        canvasSource.width = 250;
        canvasSource.height = 250;
        ctx.clearRect(0, 0, 250, 250);
        
        // Square fit calculation
        const size = Math.min(img.width, img.height);
        const xOffset = (img.width - size) / 2;
        const yOffset = (img.height - size) / 2;
        
        ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, 250, 250);
        
        // Enable exports
        dl16.disabled = false;
        dl32.disabled = false;
        dl192.disabled = false;
        dl512.disabled = false;
        
        showToast('Image loaded! You can now download custom icon sizes.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Setup click listeners for downloads
  dl16.addEventListener('click', () => exportIcon(16, 'favicon-16x16.png'));
  dl32.addEventListener('click', () => exportIcon(32, 'favicon-32x32.png'));
  dl192.addEventListener('click', () => exportIcon(192, 'android-chrome-192x192.png'));
  dl512.addEventListener('click', () => exportIcon(512, 'android-chrome-512x512.png'));

  function exportIcon(dimension, filename) {
    if (!img) {
      showToast('Please upload an image first!', true);
      return;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = dimension;
    tempCanvas.height = dimension;
    
    const size = Math.min(img.width, img.height);
    const xOffset = (img.width - size) / 2;
    const yOffset = (img.height - size) / 2;
    
    tempCtx.drawImage(img, xOffset, yOffset, size, size, 0, 0, dimension, dimension);
    
    tempCanvas.toBlob((blob) => {
      if (!blob) {
        showToast('Generation failed!', true);
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloaded ${filename}!`);
    }, 'image/png');
  }
}
