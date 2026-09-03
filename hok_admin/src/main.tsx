import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#1e1412',
          color: '#fcf9f5',
          border: '1px solid #c5a880',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          zIndex: 9999,
        },
        success: {
          iconTheme: {
            primary: '#c5a880',
            secondary: '#1e1412',
          },
        },
      }}
    />
    <App />
  </StrictMode>,
);
