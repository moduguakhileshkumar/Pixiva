import { showToast } from '../app.js';

export function initJwtDecoder() {
  const jwtInput = document.getElementById('jwt-input');
  const jwtHeaderOut = document.getElementById('jwt-header-out');
  const jwtPayloadOut = document.getElementById('jwt-payload-out');
  const statusBadge = document.getElementById('jwt-status-badge');

  jwtInput.addEventListener('input', () => {
    decodeToken();
  });

  function decodeToken() {
    const rawToken = jwtInput.value.trim();
    if (!rawToken) {
      jwtHeaderOut.value = '';
      jwtPayloadOut.value = '';
      statusBadge.style.display = 'none';
      return;
    }

    const parts = rawToken.split('.');
    if (parts.length !== 3) {
      jwtHeaderOut.value = 'Error: Invalid JWT structure.\nTokens must consist of three segments separated by dots (.)';
      jwtPayloadOut.value = 'Error: Check token payload.';
      statusBadge.style.display = 'none';
      return;
    }

    try {
      // Decode segments
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      jwtHeaderOut.value = JSON.stringify(headerObj, null, 2);
      jwtPayloadOut.value = JSON.stringify(payloadObj, null, 2);

      // Evaluate claims & expiration countdown
      statusBadge.style.display = 'inline-flex';
      
      if (payloadObj.exp) {
        const expTime = payloadObj.exp * 1000;
        const now = Date.now();
        const diff = expTime - now;

        if (diff < 0) {
          statusBadge.className = 'validation-badge error';
          statusBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Token Expired on: ${new Date(expTime).toLocaleString()}`;
        } else {
          statusBadge.className = 'validation-badge success';
          const hrs = Math.floor(diff / 3600000);
          const mins = Math.round((diff % 3600000) / 60000);
          statusBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Active (Expires in ${hrs}h ${mins}m)`;
        }
      } else {
        statusBadge.className = 'validation-badge success';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Decoded (No expiration claim)';
      }
    } catch (err) {
      jwtHeaderOut.value = 'Error: Base64 decode failed.';
      jwtPayloadOut.value = `Details: ${err.message}`;
      statusBadge.style.display = 'none';
    }
  }

  function base64UrlDecode(str) {
    // 1. Replace url-safe base64 mappings
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 2. Pad characters
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid base64 string.');
      }
      base64 += new Array(5 - pad).join('=');
    }
    
    // 3. Decode UTF-8 string safely
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
}
