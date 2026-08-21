import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import Drop01Page from './pages/Drop01Page';
import Drop02Page from './pages/Drop02Page';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Usamos HashRouter para máxima compatibilidad con GitHub Pages y servidores estáticos
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/merchandise/drop-01" element={<Drop01Page />} />
        <Route path="/drops/drop-01" element={<Navigate to="/merchandise/drop-01" replace />} />
        <Route path="/merchandise/drop-02" element={<Drop02Page />} />
        <Route path="/drops/drop-02" element={<Navigate to="/merchandise/drop-02" replace />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
