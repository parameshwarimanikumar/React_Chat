import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthContextProvider from './context/AuthContext'; // Import AuthContextProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthContextProvider> {/* Wrap your App with AuthContextProvider */}
      <App />
    </AuthContextProvider>
  </BrowserRouter>
);
