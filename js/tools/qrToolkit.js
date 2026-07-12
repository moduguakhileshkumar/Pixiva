import { showToast } from '../app.js';

export function initQrToolkit() {
  const qrTextInput = document.getElementById('qr-input-text');
  const fgColorInput = document.getElementById('qr-fg-color');
  const bgColorInput = document.getElementById('qr-bg-color');
  const sizeSlider = document.getElementById('qr-size-slider');
  const sizeVal = document.getElementById('qr-size-val');
  const generateBtn = document.getElementById('btn-generate-qr');
  const downloadBtn = document.getElementById('btn-download-qr');
  const canvasHolder = document.getElementById('qr-canvas-holder');

  let qrCanvas = null;

  // Sync size label
  sizeSlider.addEventListener('input', (e) => {
    sizeVal.textContent = `${e.target.value}x${e.target.value} px`;
  });

  generateBtn.addEventListener('click', generateQRCode);
  downloadBtn.addEventListener('click', downloadQRCode);

  // Initialize
  loadQRScript()
    .then(() => {
      generateQRCode();
    })
    .catch(() => {
      showToast('Failed to load QR library from CDN. Please check connection.', true);
    });

  function loadQRScript() {
    return new Promise((resolve, reject) => {
      if (window.QRCode) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function generateQRCode() {
    if (!window.QRCode) {
      showToast('QR Library is loading...', true);
      return;
    }

    const text = qrTextInput.value.trim();
    if (!text) {
      showToast('Please enter text or URL!', true);
      return;
    }

    const size = parseInt(sizeSlider.value);
    const fgColor = fgColorInput.value;
    const bgColor = bgColorInput.value;

    // Clear holder
    canvasHolder.innerHTML = '';
    
    // Create new canvas
    qrCanvas = document.createElement('canvas');
    canvasHolder.appendChild(qrCanvas);

    const options = {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor
      },
      errorCorrectionLevel: 'Q'
    };

    window.QRCode.toCanvas(qrCanvas, text, options, (err) => {
      if (err) {
        showToast('Failed to generate QR Code!', true);
        console.error(err);
        return;
      }
      showToast('QR Code generated successfully!');
    });
  }

  function downloadQRCode() {
    if (!qrCanvas) {
      showToast('Please generate a QR Code first!', true);
      return;
    }

    qrCanvas.toBlob((blob) => {
      if (!blob) {
        showToast('Download failed!', true);
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('QR Code downloaded!');
    }, 'image/png');
  }
}
