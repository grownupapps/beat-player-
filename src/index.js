import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoutes from './admin/adminRoutes';
// Später können wir hier auch die Public Player Routes importieren
// import PublicPlayerRoutes from './public-player/playerRoutes';

const App = () => {
  return (
    <Router>
      <AdminRoutes />
      {/* Später: <PublicPlayerRoutes /> */}
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);