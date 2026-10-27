import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Scan, Image as ImageIcon, Camera, Info, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkHealth } from '../services/api';

const Header = () => {
  const [backendStatus, setBackendStatus] = useState({ loading: true, online: false, modelLoaded: false });

  const verifyBackend = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true }));
    const health = await checkHealth();
    setBackendStatus({
      loading: false,
      online: health.success && health.status === 'ok',
      modelLoaded: health.model_loaded || false
    });
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30 shadow-sm'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Title */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-accent p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Scan className="w-5 h-5 text-brand-500 group-hover:text-brand-accent transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">YOLO</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-500 border border-brand-500/30 font-semibold">v8</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Object Detection AI</p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/image-detection" className={navLinkClass}>
              <ImageIcon className="w-4 h-4" />
              Image Detection
            </NavLink>
            <NavLink to="/webcam-detection" className={navLinkClass}>
              <Camera className="w-4 h-4" />
              Webcam
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              <Info className="w-4 h-4" />
              About
            </NavLink>
          </nav>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={verifyBackend}
              title="Click to check Flask API status"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/60 transition-colors"
            >
              <Server className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1.5 text-xs">
                {backendStatus.loading ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                ) : backendStatus.online ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 glow-emerald"></span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                )}
                
                <span className="font-medium">
                  {backendStatus.loading
                    ? 'Connecting...'
                    : backendStatus.online
                    ? backendStatus.modelLoaded
                      ? 'Backend Ready'
                      : 'Model Missing'
                    : 'Backend Offline'}
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/image-detection" className={navLinkClass}>
            <ImageIcon className="w-4 h-4" />
            Image
          </NavLink>
          <NavLink to="/webcam-detection" className={navLinkClass}>
            <Camera className="w-4 h-4" />
            Webcam
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            <Info className="w-4 h-4" />
            About
          </NavLink>
        </div>

      </div>
    </header>
  );
};

export default Header;
