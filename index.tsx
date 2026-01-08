
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Service Worker Registration logic.
 * Fixed: Robust origin verification to prevent registration failures in cross-origin sandboxes.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Create a URL object for the sw.js relative to the current script's origin
      const swUrl = new URL('./sw.js', window.location.origin + window.location.pathname);
      
      // Strict origin check to prevent "The origin of the provided scriptURL does not match" error
      if (swUrl.origin === window.location.origin) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then(reg => {
            console.log('Zenith SW registered successfully with scope:', reg.scope);
          })
          .catch(err => {
            console.warn('Service Worker registration deferred:', err.message);
          });
      } else {
        console.warn('Service Worker skipped: Script and Page origins do not match. This is expected in some sandboxed development environments.');
      }
    } catch (err) {
      console.error('Service Worker initialization failed:', err);
    }
  });
}
