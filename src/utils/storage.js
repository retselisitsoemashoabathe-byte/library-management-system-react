// Local Storage stores text, so we convert objects to JSON and back.

export function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
