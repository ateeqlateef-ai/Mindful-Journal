import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Ensure process.env doesn't crash the app if not defined globally
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}