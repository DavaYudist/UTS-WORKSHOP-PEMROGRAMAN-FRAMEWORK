import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Kategori from './pages/Kategori';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kategori />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="*" element={<Navigate to="/kategori" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
