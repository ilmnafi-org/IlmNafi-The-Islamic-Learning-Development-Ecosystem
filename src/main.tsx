import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Override Local & Session Storage to keep things strictly in memory & prevent writing to disk
class InMemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

// Clear legacy storage and apply temporary memory engine
try {
  window.localStorage.clear();
  window.sessionStorage.clear();
} catch (e) {
  // Graceful fallback for strict iframe environments
}

try {
  Object.defineProperty(window, 'localStorage', { value: new InMemoryStorage(), writable: true });
  Object.defineProperty(window, 'sessionStorage', { value: new InMemoryStorage(), writable: true });
} catch (e) {
  // Fallback direct assignment if non-configurable
  (window as any).localStorage = new InMemoryStorage();
  (window as any).sessionStorage = new InMemoryStorage();
}

// Complete logging suppression for clean production environment
console.log = () => {};
console.info = () => {};
console.debug = () => {};
console.warn = () => {};
console.error = () => {};

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        // Log suppressed by global mute
      })
      .catch((err) => {
        // Warning suppressed by global mute
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

