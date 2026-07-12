import { showToast } from '../app.js';

export function initImageBlur() {
  const dropzone = document.getElementById('blur-dropzone');
  const fileInput = document.getElementById('blur-file-input');
  const blurSlider = document.getElementById('blur-range');
  const blurVal = document.getElementById('blur-radius-val');
  const focusRadiusSlider = document.getElementById('blur-focus-radius');
  const canvas = document.getElementById('canvas-blur-render');
  const downloadBtn = document.getElementById('btn-download-blur');

  let img = null;
  const ctx = canvas.getContext('2d');
  let focalX = 0;
  let focalY = 0;

  // Listeners
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

  blurSlider.addEventListener('input', (e) => {
    blurVal.textContent = `${e.target.value}px`;
    renderBlurEffect();
  });

  focusRadiusSlider.addEventListener('input', () => {
    renderBlurEffect();
  });

  // Click canvas to reposition focal focus point
  canvas.addEventListener('click', (e) => {
    if (!img) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    focalX = Math.round((x / rect.width) * canvas.width);
    focalY = Math.round((y / rect.height) * canvas.height);
    
    renderBlurEffect();
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
        const maxWidth = 600;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Center focus point originally
        focalX = canvas.width / 2;
        focalY = canvas.height / 2;
        
        downloadBtn.disabled = false;
        renderBlurEffect();
        showToast('Image loaded! Adjust sliders or click on image to focus.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function renderBlurEffect() {
    if (!img) return;

    const w = canvas.width;
    const h = canvas.height;
    const blurRadius = parseInt(blurSlider.value);
    
    // Convert slider percentage to pixels
    const maxDimension = Math.max(w, h);
    const focusRadius = (parseInt(focusRadiusSlider.value) / 100) * maxDimension;

    // 1. Create blurred offscreen canvas
    const blurredCanvas = document.createElement('canvas');
    blurredCanvas.width = w;
    blurredCanvas.height = h;
    const bCtx = blurredCanvas.getContext('2d');
    
    if (blurRadius > 0) {
      bCtx.filter = `blur(${blurRadius}px)`;
    }
    bCtx.drawImage(img, 0, 0, w, h);

    // 2. Create sharp offscreen canvas
    const sharpCanvas = document.createElement('canvas');
    sharpCanvas.width = w;
    sharpCanvas.height = h;
    const sCtx = sharpCanvas.getContext('2d');
    sCtx.drawImage(img, 0, 0, w, h);

    // 3. Create radial mask of focal focus on sharp offscreen canvas
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mCtx = maskCanvas.getContext('2d');

    const gradient = mCtx.createRadialGradient(
      focalX, focalY, 0,
      focalX, focalY, focusRadius
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.0)');
    
    mCtx.fillStyle = gradient;
    mCtx.fillRect(0, 0, w, h);

    // Composite mask onto sharp canvas (destination-in retains pixels only in mask)
    sCtx.globalCompositeOperation = 'destination-in';
    sCtx.drawImage(maskCanvas, 0, 0);

    // 4. Render back together on main canvas
    ctx.clearRect(0, 0, w, h);
    // Draw background blur
    ctx.drawImage(blurredCanvas, 0, 0);
    // Overlay the focused segment
    ctx.drawImage(sharpCanvas, 0, 0);
  }

  // Export focal blurred image
  downloadBtn.addEventListener('click', () => {
    if (!img) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('Export failed!', true);
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `focused-image.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Focused image downloaded!');
    }, 'image/png');
  });
}
