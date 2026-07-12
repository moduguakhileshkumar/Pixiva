import { fileToImage, drawCanvas, canvasToBlob } from '../engine.js';
import { saveToShelf, saveTask } from '../db.js';
import { showToast, initMediaShelf, renderRecentTasks, formatBytes } from '../app.js';

export function initCompressor() {
  const dropzone = document.getElementById('compressor-dropzone');
  const fileInput = document.getElementById('compressor-file-input');
  
  const activeWorkspace = document.getElementById('active-workspace');
  const fileNameLabel = document.getElementById('active-file-name');
  const fileSizeLabel = document.getElementById('active-file-size');
  
  // Slider overlay controls
  const sliderWorkspace = document.getElementById('slider-workspace');
  const sliderOpt = document.getElementById('slider-img-opt');
  const sliderHandle = document.getElementById('slider-handle');
  const imgOrigSrc = document.getElementById('img-orig-src');
  const imgOptSrc = document.getElementById('img-opt-src');
  
  // Inputs
  const qualitySlider = document.getElementById('compress-quality');
  const qualityVal = document.getElementById('quality-val');
  const scaleSlider = document.getElementById('compress-scale');
  const scaleVal = document.getElementById('scale-val');
  
  const downloadBtn = document.getElementById('btn-download-compressed');
  
  // Stats
  const sizeOrigLabel = document.getElementById('compare-size-orig');
  const sizeOptLabel = document.getElementById('compare-size-opt');
  const savingsLabel = document.getElementById('compare-savings-pct');

  let activeFile = null;
  let originalImageElement = null;
  let optimizedBlob = null;
  let isDragging = false;

  // 1. File Upload Interactions
  if (dropzone) {
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
        processUpload(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        processUpload(e.target.files[0]);
      }
    });
  }

  // Bind custom workspace load event
  window.addEventListener('workspaceFileSelected', (e) => {
    // Reconstruct File from base64 dataUrl
    const item = e.detail;
    fetch(item.dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], item.name, { type: item.type });
        processUpload(file, false); // Don't re-save to DB
      });
  });

  // Bind clipboard paste event
  window.addEventListener('clipboardFilePasted', (e) => {
    processUpload(e.detail);
  });

  // Settings Change Triggers
  if (qualitySlider) {
    qualitySlider.addEventListener('input', (e) => {
      qualityVal.textContent = `${e.target.value}%`;
    });
    qualitySlider.addEventListener('change', runImageProcessing);
  }

  if (scaleSlider) {
    scaleSlider.addEventListener('input', (e) => {
      scaleVal.textContent = `${e.target.value}%`;
    });
    scaleSlider.addEventListener('change', runImageProcessing);
  }

  // 2. Drag Visual Split-Slider Compare Logic
  if (sliderHandle && sliderWorkspace) {
    // Mouse events
    sliderHandle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', handleDrag);

    // Touch events (mobile)
    sliderHandle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', handleDrag);
  }

  function handleDrag(e) {
    if (!isDragging) return;
    
    const rect = sliderWorkspace.getBoundingClientRect();
    let clientX = e.clientX;

    // Handle touch coordinate extracts
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    }

    let positionX = clientX - rect.left;
    
    // Bounds constrain
    if (positionX < 0) positionX = 0;
    if (positionX > rect.width) positionX = rect.width;

    const percentage = (positionX / rect.width) * 100;
    
    // Move visual dividers
    sliderHandle.style.left = `${percentage}%`;
    sliderOpt.style.width = `${percentage}%`;
  }

  // 3. Image Operations & Process Flows
  async function processUpload(file, saveToDb = true) {
    if (!file.type.match('image.*') && !file.name.toLowerCase().endsWith('.heic')) {
      showToast('Please upload a valid image file!', true);
      return;
    }

    activeFile = file;
    fileNameLabel.textContent = file.name;
    fileSizeLabel.textContent = formatBytes(file.size);
    sizeOrigLabel.textContent = formatBytes(file.size);

    showToast('Decoding image in memory...');

    try {
      originalImageElement = await fileToImage(file);
      
      // Update UI Previews
      const blobUrl = URL.createObjectURL(file);
      imgOrigSrc.src = blobUrl;
      imgOptSrc.src = blobUrl;

      // Persist in media shelf database
      if (saveToDb) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          await saveToShelf({
            id: file.name + '-' + file.size,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result
          });
          initMediaShelf();
        };
        reader.readAsDataURL(file);
      }

      // Open workspace view
      if (dropzone) dropzone.style.display = 'none';
      activeWorkspace.style.display = 'block';

      // Reset sliders
      qualitySlider.value = 80;
      qualityVal.textContent = '80%';
      scaleSlider.value = 100;
      scaleVal.textContent = '100%';

      // Run initial compression
      runImageProcessing();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function runImageProcessing() {
    if (!originalImageElement) return;

    const scale = parseInt(scaleSlider.value) / 100;
    const quality = parseInt(qualitySlider.value) / 100;

    const targetWidth = Math.round(originalImageElement.width * scale);
    const targetHeight = Math.round(originalImageElement.height * scale);

    // Scale canvas
    const canvas = drawCanvas(originalImageElement, targetWidth, targetHeight);

    // Compress
    const exportType = activeFile.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
    optimizedBlob = await canvasToBlob(canvas, exportType, quality);

    // Update Optimized view
    const optUrl = URL.createObjectURL(optimizedBlob);
    imgOptSrc.src = optUrl;

    // Update UI Stats
    sizeOptLabel.textContent = formatBytes(optimizedBlob.size);
    
    const diffBytes = activeFile.size - optimizedBlob.size;
    const pct = Math.round((diffBytes / activeFile.size) * 100);

    if (pct > 0) {
      savingsLabel.textContent = `Saved ${pct}%`;
      savingsLabel.style.color = 'var(--color-success)';
    } else {
      savingsLabel.textContent = `File size increased`;
      savingsLabel.style.color = 'var(--color-danger)';
    }
  }

  // 4. Download Trigger
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      if (!optimizedBlob) return;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(optimizedBlob);

      const ext = activeFile.type === 'image/webp' ? 'webp' : 'jpg';
      const baseName = activeFile.name.substring(0, activeFile.name.lastIndexOf('.')) || 'image';
      link.download = `pixiva-compressed-${baseName}.${ext}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log task to local history
      await saveTask({
        operation: `Compress ${ext.toUpperCase()}`,
        sizeText: `${formatBytes(optimizedBlob.size)} (Saved ${Math.max(0, Math.round(((activeFile.size - optimizedBlob.size) / activeFile.size) * 100))}% )`,
        status: 'Completed'
      });

      renderRecentTasks();
      showToast('Image downloaded successfully!');
    });
  }
}
