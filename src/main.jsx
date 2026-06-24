import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
      richColors
      closeButton
    />
  </React.StrictMode>
);
