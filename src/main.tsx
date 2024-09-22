import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DreadUiProvider } from 'dread-ui';
import 'dread-ui/style.scss';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DreadUiProvider>
      <App />
    </DreadUiProvider>
  </React.StrictMode>,
);
