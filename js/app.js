import { tools } from './tools.js';
import { loadShelfItems, clearShelf, loadTasks, clearTasks } from './db.js';

// DOM Elements
const body = document.body;
const commandPaletteTrigger = document.getElementById('palette-trigger');
const commandOverlay = document.getElementById('command-palette-overlay');
const commandInput = document.getElementById('command-input');
const commandResults = document.getElementById('command-results');
const shelfItems = document.getElementById('shelf-items');
const shelfClear = document.getElementById('shelf-clear');

// Toast alert DOM elements
let toastElement = null;
let toastMsgElement = null;

document.addEventListener('DOMContentLoaded', () => {
  createToastDOM();

  // Register service worker for offline operations
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.log('Service Worker registration failed:', err));
  }

  // Initialize features
  initCommandPalette();
  initMediaShelf();
  initFAQAccordions();
  renderRecentTasks();
  initFavorites();
  initClipboardPaste();
  initMobileBottomNav();

  // Listen to shelf clicks
  if (shelfClear) {
    shelfClear.addEventListener('click', async () => {
      await clearShelf();
      initMediaShelf();
      showToast('Workspace shelf cleared.');
    });
  }
});

// Clipboard paste listener (Saves screenshots directly to workspace)
function initClipboardPaste() {
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        
        // Wrap as a real file with a clean name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const renamedFile = new File([file], `screenshot-${timestamp}.png`, { type: 'image/png' });

        const pasteEvent = new CustomEvent('clipboardFilePasted', { detail: renamedFile });
        window.dispatchEvent(pasteEvent);
        showToast('Image pasted from clipboard!');
        break;
      }
    }
  });
}

// Favorites List Manager (persisted in localStorage)
function initFavorites() {
  const favoritesContainer = document.getElementById('favorites-nav-section');
  if (!favoritesContainer) return;

  function renderFavorites() {
    let favSlugs = JSON.parse(localStorage.getItem('pixiva_favs') || '[]');
    favoritesContainer.innerHTML = '';

    if (favSlugs.length === 0) {
      favoritesContainer.style.display = 'none';
      return;
    }

    favoritesContainer.style.display = 'block';
    
    const title = document.createElement('div');
    title.className = 'nav-section-title';
    title.innerHTML = '<i class="fa-solid fa-star" style="color:var(--color-warning);"></i> Favorites';
    favoritesContainer.appendChild(title);

    favSlugs.forEach(slug => {
      const toolMeta = tools.find(t => t.slug === slug);
      if (!toolMeta) return;

      const link = document.createElement('a');
      link.href = getToolUrl(slug);
      link.className = 'nav-link';
      link.innerHTML = `
        <i class="fa-solid ${toolMeta.icon || 'fa-gear'}"></i>
        <span>${toolMeta.name}</span>
      `;
      favoritesContainer.appendChild(link);
    });
  }

  // Expose toggle favorite method globally on window so HTML elements can call it
  window.toggleFavorite = function(slug, btnElement) {
    let favSlugs = JSON.parse(localStorage.getItem('pixiva_favs') || '[]');
    const idx = favSlugs.indexOf(slug);

    if (idx >= 0) {
      favSlugs.splice(idx, 1);
      btnElement.classList.remove('active');
      showToast('Removed from favorites.');
    } else {
      favSlugs.push(slug);
      btnElement.classList.add('active');
      showToast('Added to favorites!');
    }

    localStorage.setItem('pixiva_favs', JSON.stringify(favSlugs));
    renderFavorites();
  };

  renderFavorites();
}

// Mobile Bottom Navigation Links mapping
function initMobileBottomNav() {
  const bottomLinks = document.querySelectorAll('.bottom-nav-link');
  bottomLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const action = link.getAttribute('data-action');
      if (action === 'search') {
        e.preventDefault();
        document.getElementById('palette-trigger').click();
      } else if (action === 'history') {
        e.preventDefault();
        const historySec = document.querySelector('.history-section');
        if (historySec) {
          historySec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// Toast Overlay System
function createToastDOM() {
  if (document.getElementById('toast-alert')) return;
  toastElement = document.createElement('div');
  toastElement.className = 'toast';
  toastElement.id = 'toast-alert';
  toastElement.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span id="toast-msg">Done</span>';
  body.appendChild(toastElement);
  toastMsgElement = document.getElementById('toast-msg');
}

export function showToast(msg, isError = false) {
  if (!toastElement) return;
  toastMsgElement.textContent = msg;
  toastElement.className = isError ? 'toast show btn-secondary' : 'toast show';
  toastElement.style.borderLeft = isError ? '3px solid var(--color-danger)' : '3px solid var(--color-success)';
  toastElement.querySelector('i').className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
  toastElement.querySelector('i').style.color = isError ? 'var(--color-danger)' : 'var(--color-success)';

  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3000);
}

// Media Shelf Loader
export async function initMediaShelf() {
  if (!shelfItems) return;
  
  try {
    const items = await loadShelfItems();
    shelfItems.innerHTML = '';

    if (items.length === 0) {
      shelfItems.innerHTML = '<div class="shelf-empty-hint">No uploads yet</div>';
      return;
    }

    items.forEach(item => {
      const thumb = document.createElement('div');
      thumb.className = 'shelf-thumb';
      thumb.title = `${item.name} (${formatBytes(item.size)})`;
      
      const img = document.createElement('img');
      img.src = item.dataUrl;
      
      thumb.appendChild(img);

      // On thumbnail click, notify active tool page to load this file
      thumb.addEventListener('click', () => {
        const selectEvent = new CustomEvent('workspaceFileSelected', { detail: item });
        window.dispatchEvent(selectEvent);
        showToast(`Loaded ${item.name} into workspace`);
      });

      shelfItems.appendChild(thumb);
    });
  } catch (err) {
    console.error('Failed to load shelf:', err);
  }
}

// Recent Tasks Logger rendering
export async function renderRecentTasks() {
  const historyList = document.getElementById('recent-tasks-list');
  if (!historyList) return;

  try {
    const tasks = await loadTasks();
    historyList.innerHTML = '';

    if (tasks.length === 0) {
      historyList.innerHTML = '<div class="shelf-empty-hint" style="text-align: left; padding-left: 10px;">No recent tasks logged. Complete an action to log history.</div>';
      return;
    }

    tasks.forEach(task => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const timeText = formatRelativeTime(task.timestamp);
      
      item.innerHTML = `
        <div class="history-info">
          <span class="history-time">${timeText}</span>
          <span class="history-op">${task.operation}</span>
          <span class="history-meta">${task.sizeText}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="status-done" style="font-size: 0.8rem;"><i class="fa-solid fa-circle-check"></i> ${task.status}</span>
        </div>
      `;

      historyList.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to render tasks:', err);
  }
}

// FAQ Accordion slider mechanics
function initFAQAccordions() {
  const headers = document.querySelectorAll('.faq-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.faq-card');
      const body = card.querySelector('.faq-body');

      const isOpen = card.classList.contains('open');
      
      document.querySelectorAll('.faq-card').forEach(c => {
        c.classList.remove('open');
        const b = c.querySelector('.faq-body');
        if (b) b.style.maxHeight = null;
      });

      if (!isOpen) {
        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

// Command Palette Keyboard Navigation and Filters
function initCommandPalette() {
  if (!commandPaletteTrigger || !commandOverlay) return;

  commandPaletteTrigger.addEventListener('click', openPalette);
  
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandOverlay.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    
    if (e.key === 'Escape' && commandOverlay.classList.contains('open')) {
      closePalette();
    }
  });

  commandOverlay.addEventListener('click', (e) => {
    if (e.target === commandOverlay) {
      closePalette();
    }
  });

  commandInput.addEventListener('input', () => {
    renderCommandResults(commandInput.value);
  });

  commandInput.addEventListener('keydown', (e) => {
    const items = commandResults.querySelectorAll('.command-result-item');
    if (items.length === 0) return;

    let selectedIdx = -1;
    items.forEach((item, idx) => {
      if (item.classList.contains('selected')) {
        selectedIdx = idx;
      }
    });

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (selectedIdx + 1) % items.length;
      updateSelection(items, nextIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (selectedIdx - 1 + items.length) % items.length;
      updateSelection(items, prevIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0) {
        items[selectedIdx].click();
      }
    }
  });

  function openPalette() {
    commandOverlay.classList.add('open');
    commandInput.value = '';
    renderCommandResults('');
    setTimeout(() => commandInput.focus(), 50);
  }

  function closePalette() {
    commandOverlay.classList.remove('open');
  }

  function updateSelection(items, targetIdx) {
    items.forEach(item => item.classList.remove('selected'));
    items[targetIdx].classList.add('selected');
    items[targetIdx].scrollIntoView({ block: 'nearest' });
  }

  function renderCommandResults(query) {
    const cleanQuery = query.toLowerCase().trim();
    commandResults.innerHTML = '';

    const filtered = tools.filter(t => 
      t.name.toLowerCase().includes(cleanQuery) || 
      t.title.toLowerCase().includes(cleanQuery) || 
      t.slug.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      commandResults.innerHTML = '<div style="padding: 16px; color: var(--text-muted); font-size: 0.88rem; text-align: center;">No tools found matching query</div>';
      return;
    }

    filtered.forEach((tool, idx) => {
      const item = document.createElement('a');
      item.href = getToolUrl(tool.slug);
      item.className = 'command-result-item';
      if (idx === 0) item.classList.add('selected');

      item.innerHTML = `
        <div class="command-result-info">
          <i class="fa-solid ${tool.icon || 'fa-gear'}"></i>
          <span>${tool.name}</span>
        </div>
        <span class="command-result-shortcut">Go to page</span>
      `;

      item.addEventListener('click', () => {
        closePalette();
      });

      commandResults.appendChild(item);
    });
  }
}

// Helper to determine URL path based on file depths
function getToolUrl(slug) {
  const pathDepth = window.location.pathname.split('/').filter(p => p.length > 0);
  const depth = pathDepth.length;
  let prefix = './';
  if (pathDepth.includes('compare') || pathDepth.includes('webp-to-png') || pathDepth.includes('png-to-webp') || pathDepth.includes('heic-to-jpg') || pathDepth.includes('avif-to-png') || pathDepth.includes('svg-to-png') || pathDepth.includes('png-to-ico') || pathDepth.includes('image-compressor') || pathDepth.includes('image-resizer')) {
    prefix = '../';
    if (pathDepth.includes('compare')) {
      prefix = '../../';
    }
  }
  return `${prefix}${slug}/`;
}

// Helpers
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);

  if (secs < 60) return 'Just now';
  if (navigator.language === 'en') {
    // Standard english labels
  }
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(timestamp).toLocaleDateString();
}
