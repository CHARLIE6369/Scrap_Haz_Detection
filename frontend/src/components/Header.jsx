
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Scan,
  Camera,
  Image as ImageIcon,
  Info,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { checkHealth } from '../services/api';

const Header = () => {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const pollHealth = async () => {
      try {
        const res = await checkHealth();

        console.log('Health API response:', res);

        // Backend response:
        // {
        //   success: true,
        //   data: {
        //     status: "ok",
        //     model_loaded: true
        //   }
        // }

        if (res?.success === true && res?.data?.status === 'ok') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setBackendStatus('offline');
      }
    };

    pollHealth();

    const interval = setInterval(pollHealth, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Scan className="w-6 h-6 text-white" />
            </div>

            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                YOLO<span className="text-indigo-400">Vision</span>
              </span>

              <span className="block text-[10px] text-indigo-300 tracking-widest font-mono uppercase -mt-1">
                AI Object Detection
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/detect-image"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image Detection</span>
            </NavLink>

            <NavLink
              to="/webcam"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <Camera className="w-4 h-4" />
              <span>Webcam</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </NavLink>

          </nav>

          {/* Backend Health Status Badge */}
          <div className="flex items-center">

            {backendStatus === 'online' ? (

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>

                <span className="font-mono">
                  Backend API: Online
                </span>
              </div>

            ) : backendStatus === 'offline' ? (

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />

                <span className="font-mono">
                  API: Offline
                </span>
              </div>

            ) : (

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 text-xs font-medium">
                <Activity className="w-3.5 h-3.5 animate-spin" />

                <span className="font-mono">
                  Checking API...
                </span>
              </div>

            )}

          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-800/60 py-2 px-4 bg-gray-950/80">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${
              isActive ? 'text-indigo-400' : 'text-gray-400'
            }`
          }
        >
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/detect-image"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${
              isActive ? 'text-indigo-400' : 'text-gray-400'
            }`
          }
        >
          <ImageIcon className="w-4 h-4 mb-0.5" />
          <span>Image</span>
        </NavLink>

        <NavLink
          to="/webcam"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${
              isActive ? 'text-indigo-400' : 'text-gray-400'
            }`
          }
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span>Webcam</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-1 ${
              isActive ? 'text-indigo-400' : 'text-gray-400'
            }`
          }
        >
          <Info className="w-4 h-4 mb-0.5" />
          <span>About</span>
        </NavLink>

      </div>
    </header>
  );
};

export default Header;
