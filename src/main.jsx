import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AdminProvider } from "./contexts/AdminContext";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </StrictMode>
);
