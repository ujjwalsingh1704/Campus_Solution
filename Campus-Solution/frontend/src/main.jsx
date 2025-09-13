import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('Starting React app...');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  console.log('Root created:', root);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  document.getElementById('root').innerHTML = `
    <div style="min-height: 100vh; background: #1f2937; color: white; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">React App Failed to Load</h1>
        <p style="color: #9ca3af; margin-bottom: 1rem;">Error: ${error.message}</p>
        <p style="color: #6b7280; font-size: 0.875rem;">Check the console for more details</p>
      </div>
    </div>
  `;
}
