import { showToast } from '../app.js';

export function initJsonFormatter() {
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const validBadge = document.getElementById('json-valid-badge');
  
  const btnFmt2 = document.getElementById('btn-json-fmt2');
  const btnFmt4 = document.getElementById('btn-json-fmt4');
  const btnMinify = document.getElementById('btn-json-minify');
  const btnClear = document.getElementById('btn-json-clear');
  const btnCopy = document.getElementById('btn-copy-json');

  // Input listener for live validation feedback
  jsonInput.addEventListener('input', () => {
    validateJSON(false); // quiet validation
  });

  btnFmt2.addEventListener('click', () => {
    runFormatter(2);
  });

  btnFmt4.addEventListener('click', () => {
    runFormatter(4);
  });

  btnMinify.addEventListener('click', () => {
    runFormatter(0);
  });

  btnClear.addEventListener('click', () => {
    jsonInput.value = '';
    jsonOutput.value = '';
    validBadge.style.display = 'none';
    showToast('Cleared input fields.');
  });

  btnCopy.addEventListener('click', () => {
    if (!jsonOutput.value) {
      showToast('Nothing to copy!', true);
      return;
    }
    navigator.clipboard.writeText(jsonOutput.value);
    showToast('JSON copied to clipboard!');
  });

  function validateJSON(showAlert = false) {
    const rawVal = jsonInput.value.trim();
    if (!rawVal) {
      validBadge.style.display = 'none';
      return false;
    }

    try {
      JSON.parse(rawVal);
      validBadge.style.display = 'inline-flex';
      validBadge.className = 'validation-badge success';
      validBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Valid JSON';
      return true;
    } catch (err) {
      validBadge.style.display = 'inline-flex';
      validBadge.className = 'validation-badge error';
      validBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Invalid: ${err.message.split('at position')[0]}`;
      if (showAlert) {
        showToast('Invalid JSON syntax!', true);
      }
      return false;
    }
  }

  function runFormatter(spaceCount) {
    const rawVal = jsonInput.value.trim();
    if (!rawVal) {
      showToast('Please paste a JSON string first!', true);
      return;
    }

    if (!validateJSON(true)) return;

    try {
      const parsed = JSON.parse(rawVal);
      let result = '';
      if (spaceCount === 0) {
        result = JSON.stringify(parsed);
        showToast('JSON Minified!');
      } else {
        result = JSON.stringify(parsed, null, spaceCount);
        showToast('JSON Beautified!');
      }
      jsonOutput.value = result;
    } catch (err) {
      showToast('Failed to format. Double check syntax.', true);
    }
  }
}
