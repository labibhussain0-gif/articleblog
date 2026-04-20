import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
const content = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

if (container?.hasChildNodes()) {
  hydrateRoot(container, content);
} else {
  createRoot(container!).render(content);
}
