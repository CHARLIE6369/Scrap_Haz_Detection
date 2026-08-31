import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ImageDetection from './pages/ImageDetection';
import WebcamDetection from './pages/WebcamDetection';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0b0f17] text-gray-100 selection:bg-indigo-500 selection:text-white">
        {/* Background glow effects */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

        {/* Navbar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect-image" element={<ImageDetection />} />
            <Route path="/webcam" element={<WebcamDetection />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-900 bg-gray-950/80 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
            <div>
              <span>YOLO Object Detection Web Application &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>React + Vite + Tailwind</span>
              <span>•</span>
              <span>Ultralytics YOLO v8</span>
              <span>•</span>
              <span>Flask REST API</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
