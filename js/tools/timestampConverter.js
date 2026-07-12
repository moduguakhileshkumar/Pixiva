import { showToast } from '../app.js';

export function initTimestampConverter() {
  const liveStamp = document.getElementById('epoch-live-stamp');
  const liveDate = document.getElementById('epoch-live-date');

  const epochInput = document.getElementById('epoch-val-input');
  const btnConvEpoch = document.getElementById('btn-convert-epoch');
  const outIso = document.getElementById('epoch-out-iso');
  const outUtc = document.getElementById('epoch-out-utc');
  const outLocal = document.getElementById('epoch-out-local');

  const dateInput = document.getElementById('date-val-input');
  const outSec = document.getElementById('date-out-sec');
  const outMs = document.getElementById('date-out-ms');
  const btnConvDate = document.getElementById('btn-convert-date');

  const copySec = document.getElementById('btn-copy-sec-epoch');
  const copyMs = document.getElementById('btn-copy-ms-epoch');

  // Live ticking clock
  setInterval(() => {
    const now = new Date();
    const stamp = Math.floor(now.getTime() / 1000);
    liveStamp.textContent = stamp;
    liveDate.textContent = now.toLocaleString();
  }, 1000);

  // Set default initial values
  const now = new Date();
  epochInput.value = Math.floor(now.getTime() / 1000);
  
  // Format current local time to YYYY-MM-DDThh:mm for datetime-local input
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
  dateInput.value = localISOTime;

  // Run initial conversions on load
  runEpochConversion();
  runDateConversion();

  // Button triggers
  btnConvEpoch.addEventListener('click', runEpochConversion);
  btnConvDate.addEventListener('click', runDateConversion);

  // Auto conversion on pressing Enter key
  epochInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runEpochConversion();
  });

  // Copy click listeners
  copySec.addEventListener('click', () => {
    if (outSec.textContent === '-') return;
    navigator.clipboard.writeText(outSec.textContent);
    showToast(`Copied seconds: ${outSec.textContent}`);
  });

  copyMs.addEventListener('click', () => {
    if (outMs.textContent === '-') return;
    navigator.clipboard.writeText(outMs.textContent);
    showToast(`Copied milliseconds: ${outMs.textContent}`);
  });

  function runEpochConversion() {
    const rawVal = epochInput.value.trim();
    if (!rawVal) {
      showToast('Enter a valid epoch count!', true);
      return;
    }

    let timestamp = parseInt(rawVal);
    
    // Auto-detect seconds vs milliseconds (length of 13 -> ms)
    if (rawVal.length >= 13) {
      // Milliseconds
    } else {
      // Seconds -> convert to ms
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      showToast('Invalid epoch value!', true);
      outIso.textContent = 'Invalid Date';
      outUtc.textContent = 'Invalid Date';
      outLocal.textContent = 'Invalid Date';
      return;
    }

    outIso.textContent = date.toISOString();
    outUtc.textContent = date.toUTCString();
    outLocal.textContent = date.toString();
  }

  function runDateConversion() {
    const rawVal = dateInput.value;
    if (!rawVal) {
      showToast('Select a date first!', true);
      return;
    }

    const date = new Date(rawVal);
    if (isNaN(date.getTime())) {
      showToast('Invalid date value!', true);
      return;
    }

    const ms = date.getTime();
    const sec = Math.floor(ms / 1000);

    outSec.textContent = sec;
    outMs.textContent = ms;
  }
}
