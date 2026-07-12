import { showToast } from '../app.js';

export function initColorPicker() {
  const dropzone = document.getElementById('picker-dropzone');
  const fileInput = document.getElementById('picker-file-input');
  const canvas = document.getElementById('canvas-picker');
  const cursorPrev = document.getElementById('color-cursor-prev');
  const cursorHex = document.getElementById('color-cursor-hex');
  const cursorRgb = document.getElementById('color-cursor-rgb');
  const activeHexInput = document.getElementById('active-hex-input');
  const copyHexBtn = document.getElementById('btn-copy-hex');
  const saveBtn = document.getElementById('btn-add-to-palette');
  const clearBtn = document.getElementById('btn-clear-palette');
  const paletteContainer = document.getElementById('palette-display-container');

  let img = null;
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  let savedPalette = ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1', '#F1F5F9'];

  // Initialize display
  renderPalette();

  // File loading events
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
        // Size canvas
        const maxWidth = 500;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        showToast('Image loaded! Move cursor over image to pick color.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Hover pick color
  canvas.addEventListener('mousemove', (e) => {
    if (!img) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale matching coordinate mapping
    const canvasX = Math.round((x / rect.width) * canvas.width);
    const canvasY = Math.round((y / rect.height) * canvas.height);
    
    try {
      const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      
      cursorPrev.style.backgroundColor = hex;
      cursorHex.textContent = `HEX: ${hex}`;
      cursorRgb.textContent = `RGB: ${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
    } catch (err) {
      // Out of bounds or CORS issues (should not happen with local blobs)
    }
  });

  // Click lock color
  canvas.addEventListener('click', (e) => {
    if (!img) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const canvasX = Math.round((x / rect.width) * canvas.width);
    const canvasY = Math.round((y / rect.height) * canvas.height);
    
    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    
    activeHexInput.value = hex;
    showToast(`Locked color: ${hex}`);
  });

  // Copy Active Color
  copyHexBtn.addEventListener('click', () => {
    if (!activeHexInput.value) {
      showToast('Select a color from the image first!', true);
      return;
    }
    navigator.clipboard.writeText(activeHexInput.value);
    showToast(`Copied ${activeHexInput.value} to clipboard!`);
  });

  // Save to palette
  saveBtn.addEventListener('click', () => {
    const activeColor = activeHexInput.value;
    if (!activeColor) {
      showToast('Please select a color first!', true);
      return;
    }
    
    if (savedPalette.includes(activeColor)) {
      showToast('Color already in palette!', true);
      return;
    }

    if (savedPalette.length >= 6) {
      savedPalette.shift(); // Remove oldest
    }
    savedPalette.push(activeColor);
    renderPalette();
    showToast('Saved color to palette!');
  });

  // Clear palette
  clearBtn.addEventListener('click', () => {
    savedPalette = [];
    renderPalette();
    showToast('Palette cleared');
  });

  function renderPalette() {
    paletteContainer.innerHTML = '';
    savedPalette.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-color';
      swatch.style.backgroundColor = color;
      
      const label = document.createElement('span');
      label.className = 'palette-color-hex';
      label.textContent = color;
      
      swatch.appendChild(label);
      
      // Copy swatch on click
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        showToast(`Copied ${color} to clipboard!`);
      });
      
      paletteContainer.appendChild(swatch);
    });
  }

  function rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = c.toString(16).toUpperCase();
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
}
