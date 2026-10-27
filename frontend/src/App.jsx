import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ImageDetection from './pages/ImageDetection';
import WebcamDetection from './pages/WebcamDetection';
import About from './pages/About';

function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-detection" element={<ImageDetection />} />
          <Route path="/webcam-detection" element={<WebcamDetection />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 YOLO Object Detection Web App. Built with React & Flask.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Version 1.0.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="text-slate-400">Ultralytics YOLO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
