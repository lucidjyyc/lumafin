import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './lib/components/ErrorBoundary';
import { errorLogger } from './lib/services/errorLogger';

// Initialize error logging
errorLogger.init(import.meta.env.VITE_SENTRY_DSN);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
