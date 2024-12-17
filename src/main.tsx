import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Load environment variables
const requiredEnvVars = [
  'VITE_AIRTABLE_BASE_ID',
  'VITE_AIRTABLE_CLIENT_ID',
  'VITE_AIRTABLE_CLIENT_SECRET',
  'VITE_OAUTH_REDIRECT_URI'
] as const;

// Check for required environment variables
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);