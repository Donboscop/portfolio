import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global production fetch override to automatically route relative API calls to the live backend
if (import.meta.env.PROD) {
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const backendUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      url = `${backendUrl}${url}`;
    }
    return originalFetch(url, options);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
