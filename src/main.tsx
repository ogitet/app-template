import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { fixNarrowViewport } from './viewport';

fixNarrowViewport();

const root = document.getElementById('root');
if (!root) throw new Error('index.html に #root がない');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
