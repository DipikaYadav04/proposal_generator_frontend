import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AuthGate from './auth/AuthGate';
import SSOCallback from './auth/SSOCallback';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* SSO Handshake Route - Public (no AuthGate protection) */}
        <Route path="/auth/handshake" element={<SSOCallback />} />
        
        {/* Main Application - Protected by AuthGate */}
        <Route 
          path="/*" 
          element={
            <AuthGate>
              <App />
            </AuthGate>
          } 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
