import { fileToImage, drawCanvas, canvasToBlob, encodePNGToICO } from '../engine.js';
import { saveToShelf, saveTask } from '../db.js';
import { showToast, initMediaShelf, renderRecentTasks, formatBytes } from '../app.js';

export function initConverter(presetSource = null, presetTarget = null) {
  const dropzone = document.getElementById('converter-dropzone');
  const fileInput = document.getElementById('converter-file-input');
  
  const activeWorkspace = document.getElementById('active-workspace');
  const batchList = document.getElementById('batch-list');
  const convertAllBtn = document.getElementById('btn-convert-all');
  const targetFormatSelect = document.getElementById('converter-target-format');

  let fileQueue = [];

  // Setup presets if any
  if (targetFormatSelect && presetTarget) {
    targetFormatSelect.value = presetTarget;
  }

  // File dropzone binds
  if (dropzone) {
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
        addFilesToQueue(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        addFilesToQueue(e.target.files);
      }
    });
  }

  // Workspace media shelf integration
  window.addEventListener('workspaceFileSelected', (e) => {
    const item = e.detail;
    fetch(item.dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], item.name, { type: item.type });
        addFilesToQueue([file], false); // Don't re-save to DB
      });
  });

  // Bind clipboard paste event
  window.addEventListener('clipboardFilePasted', (e) => {
    addFilesToQueue([e.detail]);
  });

  function addFilesToQueue(files, saveToDb = true) {
    Array.from(files).forEach(file => {
      // Validate preset source constraint if presetSource exists
      if (presetSource) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (presetSource === 'webp' && ext !== 'webp') {
          showToast(`This page only converts WebP files!`, true);
          return;
        }
        if (presetSource === 'heic' && ext !== 'heic') {
          showToast(`This page only converts HEIC files!`, true);
          return;
        }
        if (presetSource === 'png' && ext !== 'png') {
          showToast(`This page only converts PNG files!`, true);
          return;
        }
        if (presetSource === 'jpg' && ext !== 'jpg' && ext !== 'jpeg') {
          showToast(`This page only converts JPG files!`, true);
          return;
        }
        if (presetSource === 'svg' && ext !== 'svg') {
          showToast(`This page only converts SVG files!`, true);
          return;
        }
      }

      const fileId = file.name + '-' + file.size + '-' + Math.random().toString(36).substring(2, 5);
      
      fileQueue.push({
        id: fileId,
        file: file,
        status: 'pending',
        outputBlob: null
      });

      // Save to media shelf persistent pool
      if (saveToDb && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          await saveToShelf({
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result
          });
          initMediaShelf();
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileQueue.length > 0) {
      if (dropzone) dropzone.style.display = 'none';
      activeWorkspace.style.display = 'block';
      renderQueue();
    }
  }

  function renderQueue() {
    batchList.innerHTML = '';
    
    fileQueue.forEach(item => {
      const row = document.createElement('div');
      row.className = 'batch-row';
      row.id = `row-${item.id}`;

      let statusIcon = '<i class="fa-regular fa-clock status-pending"></i>';
      let statusText = '<span class="status-pending">Pending</span>';
      
      if (item.status === 'converting') {
        statusIcon = '<i class="fa-solid fa-spinner fa-spin status-converting"></i>';
        statusText = '<span class="status-converting">Converting...</span>';
      } else if (item.status === 'done') {
        statusIcon = '<i class="fa-solid fa-circle-check status-done"></i>';
        statusText = '<span class="status-done">Completed</span>';
      } else if (item.status === 'error') {
        statusIcon = '<i class="fa-solid fa-circle-xmark status-error"></i>';
        statusText = '<span class="status-error">Failed</span>';
      }

      row.innerHTML = `
        <div class="batch-col-name" title="${item.file.name}">${item.file.name}</div>
        <div class="batch-col-size">${formatBytes(item.file.size)}</div>
        <div class="batch-col-status">${statusIcon} ${statusText}</div>
        <div class="batch-col-action" id="action-${item.id}">
          ${item.outputBlob ? `<button class="btn btn-secondary btn-download-row" style="padding: 4px 8px; font-size: 0.75rem;"><i class="fa-solid fa-download"></i> Save</button>` : '-'}
        </div>
        <div>
          <button class="btn-delete-row" style="background:none; border:none; color:var(--text-muted); cursor:pointer;" data-id="${item.id}"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;

      // Bind download click to row item
      const downloadRowBtn = row.querySelector('.btn-download-row');
      if (downloadRowBtn) {
        downloadRowBtn.addEventListener('click', () => downloadFile(item));
      }

      // Bind delete click to row item
      row.querySelector('.btn-delete-row').addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        fileQueue = fileQueue.filter(f => f.id !== id);
        if (fileQueue.length === 0) {
          activeWorkspace.style.display = 'none';
          if (dropzone) dropzone.style.display = 'block';
        } else {
          renderQueue();
        }
      });

      batchList.appendChild(row);
    });
  }

  // 4. Batch Process Action
  if (convertAllBtn) {
    convertAllBtn.addEventListener('click', async () => {
      const targetFormat = targetFormatSelect.value;
      showToast(`Batch converting to ${targetFormat.toUpperCase()}...`);

      for (let item of fileQueue) {
        if (item.status === 'done') continue;

        item.status = 'converting';
        renderQueue();

        try {
          const img = await fileToImage(item.file);
          const canvas = drawCanvas(img, img.width, img.height);
          
          let mime = 'image/png';
          let ext = targetFormat;
          
          if (targetFormat === 'webp') mime = 'image/webp';
          else if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
            mime = 'image/jpeg';
            ext = 'jpg';
          }
          
          let blob = await canvasToBlob(canvas, mime, 0.95);
          
          // Special ICO packaging
          if (targetFormat === 'ico') {
            // First compress PNG canvas
            const pngBlob = await canvasToBlob(canvas, 'image/png');
            blob = await encodePNGToICO(pngBlob);
          }

          item.outputBlob = blob;
          item.status = 'done';
          
          // Log task completion in history
          const opName = `${item.file.name.split('.').pop().toUpperCase()} → ${targetFormat.toUpperCase()}`;
          await saveTask({
            operation: opName,
            sizeText: `${formatBytes(blob.size)}`,
            status: 'Converted'
          });
          
        } catch (err) {
          console.error(err);
          item.status = 'error';
        }
      }

      renderQueue();
      renderRecentTasks();
      showToast('Batch conversions finished!');
      
      // Auto-trigger individual downloads for completed items
      fileQueue.forEach(item => {
        if (item.status === 'done' && item.outputBlob) {
          downloadFile(item);
        }
      });
    });
  }

  function downloadFile(item) {
    if (!item.outputBlob) return;
    
    const targetFormat = targetFormatSelect.value;
    const baseName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || 'image';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(item.outputBlob);
    link.download = `quickkit-${baseName}.${targetFormat}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
