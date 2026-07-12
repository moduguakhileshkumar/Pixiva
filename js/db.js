let db = null;

export function initDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open('PixivaDB', 1);

    request.onupgradeneeded = (e) => {
      const database = e.target.result;
      
      // Store 1: Media Workspace Shelf (stores active file records)
      if (!database.objectStoreNames.contains('mediaShelf')) {
        database.createObjectStore('mediaShelf', { keyPath: 'id' });
      }
      
      // Store 2: Recent Tasks History (stores operations history log)
      if (!database.objectStoreNames.contains('recentTasks')) {
        database.createObjectStore('recentTasks', { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = (e) => {
      console.error('IndexedDB initialization failed:', e.target.error);
      reject(e.target.error);
    };
  });
}

// Media Shelf Methods
export function saveToShelf(item) {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('mediaShelf', 'readwrite');
      const store = transaction.objectStore('mediaShelf');
      const request = store.put(item); // item: { id, name, size, type, dataUrl }

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function loadShelfItems() {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('mediaShelf', 'readonly');
      const store = transaction.objectStore('mediaShelf');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function deleteFromShelf(id) {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('mediaShelf', 'readwrite');
      const store = transaction.objectStore('mediaShelf');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function clearShelf() {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('mediaShelf', 'readwrite');
      const store = transaction.objectStore('mediaShelf');
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

// Recent Tasks History Log Methods
export function saveTask(task) {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('recentTasks', 'readwrite');
      const store = transaction.objectStore('recentTasks');
      
      const record = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        ...task // task: { operation, sizeText, status }
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(record);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function loadTasks() {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('recentTasks', 'readonly');
      const store = transaction.objectStore('recentTasks');
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by timestamp descending
        const sorted = request.result.sort((a, b) => b.timestamp - a.timestamp);
        resolve(sorted.slice(0, 10)); // Limit to last 10 tasks
      };
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function clearTasks() {
  return new Promise((resolve, reject) => {
    initDB().then((database) => {
      const transaction = database.transaction('recentTasks', 'readwrite');
      const store = transaction.objectStore('recentTasks');
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}
