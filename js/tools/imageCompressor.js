import { showToast } from '../app.js';

export function initImageCompressor() {
  const dropzone = document.getElementById('compressor-dropzone');
  const fileInput = document.getElementById('compressor-file-input');
  const qualitySlider = document.getElementById('compressor-quality');
  const qualityVal = document.getElementById('quality-val');
  const widthInput = document.getElementById('compressor-width');
  const heightInput = document.getElementById('compressor-height');
  const aspectCheckbox = document.getElementById('compressor-aspect');
  const runBtn = document.getElementById('btn-run-compress');
  const downloadBtn = document.getElementById('btn-download-compressed');
  
  const sizeOrig = document.getElementById('size-orig');
  const sizeOpt = document.getElementById('size-opt');
  const savingsText = document.getElementById('compress-savings');
  
  const canvasOrig = document.getElementById('canvas-orig');
  const canvasOpt = document.getElementById('canvas-opt');
  
  let originalImage = null;
  let originalFile = null;
  let compressedBlob = null;
  let aspectRatio = 1;

  // Dropzone click & drag events
  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

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

  // Slider change label
  qualitySlider.addEventListener('input', (e) => {
    qualityVal.textContent = `${e.target.value}%`;
  });

  // Maintain aspect ratio
  widthInput.addEventListener('input', () => {
    if (aspectCheckbox.checked && originalImage && widthInput.value) {
      heightInput.value = Math.round(widthInput.value / aspectRatio);
    }
  });

  heightInput.addEventListener('input', () => {
    if (aspectCheckbox.checked && originalImage && heightInput.value) {
      widthInput.value = Math.round(heightInput.value * aspectRatio);
    }
  });

  // Handle uploaded file
  function handleFile(file) {
    if (!file.type.match('image.*')) {
      showToast('Please upload an image file!', true);
      return;
    }
    originalFile = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      originalImage = new Image();
      originalImage.onload = () => {
        // Clear old results
        compressedBlob = null;
        downloadBtn.disabled = true;
        sizeOpt.textContent = '-';
        savingsText.textContent = 'After';
        
        // Save dimensions & ratio
        aspectRatio = originalImage.width / originalImage.height;
        widthInput.value = originalImage.width;
        heightInput.value = originalImage.height;
        
        // Show size
        sizeOrig.textContent = formatBytes(file.size);
        
        // Draw original on canvas
        drawCanvas(canvasOrig, originalImage, originalImage.width, originalImage.height);
        // Copy to opt canvas temporarily
        drawCanvas(canvasOpt, originalImage, originalImage.width, originalImage.height);
        
        showToast('Image uploaded successfully!');
      };
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawCanvas(canvas, img, w, h) {
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
  }

  // Run Compression
  runBtn.addEventListener('click', () => {
    if (!originalImage) {
      showToast('Please upload an image first!', true);
      return;
    }

    const targetWidth = parseInt(widthInput.value) || originalImage.width;
    const targetHeight = parseInt(heightInput.value) || originalImage.height;
    const quality = parseFloat(qualitySlider.value) / 100;

    // Draw target size on optimized canvas
    drawCanvas(canvasOpt, originalImage, targetWidth, targetHeight);

    // Convert optimized canvas to blob (always use JPEG/WEBP for real size savings)
    const exportType = originalFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    
    canvasOpt.toBlob((blob) => {
      if (!blob) {
        showToast('Compression failed!', true);
        return;
      }
      compressedBlob = blob;
      sizeOpt.textContent = formatBytes(blob.size);
      
      const percent = Math.round(((originalFile.size - blob.size) / originalFile.size) * 100);
      if (percent > 0) {
        savingsText.textContent = `Saved ${percent}%`;
        showToast(`Compressed successfully! Saved ${percent}%`);
      } else {
        savingsText.textContent = `Increased size (Try lower quality)`;
        showToast(`Ready! Output size is slightly larger.`);
      }
      
      downloadBtn.disabled = false;
    }, exportType, quality);
  });

  // Download Compressed image
  downloadBtn.addEventListener('click', () => {
    if (!compressedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    
    // Maintain extension naming
    const ext = originalFile.type === 'image/webp' ? 'webp' : 'jpg';
    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'image';
    link.download = `optimized-${baseName}.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded!');
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
