import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Play, Pause, RefreshCw, AlertCircle, Radio } from 'lucide-react';
import { useWebcam } from '../hooks/useWebcam';

const WebcamCard = ({ onDetectFrame, isLoading, onClearResult }) => {
  const { videoRef, isCameraActive, error, startCamera, stopCamera, captureFrame } = useWebcam();

  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveIntervalMs, setLiveIntervalMs] = useState(1000);
  const liveTimerRef = useRef(null);

  const handleCaptureAndDetect = async () => {
    if (!isCameraActive || isLoading) return;
    const blob = await captureFrame();
    if (blob) {
      onDetectFrame(blob);
    } else {
      console.warn('Frame capture produced null blob.');
    }
  };

  // Live detection mode effect
  useEffect(() => {
    if (isLiveMode && isCameraActive) {
      liveTimerRef.current = setInterval(async () => {
        if (!isLoading) {
          const blob = await captureFrame();
          if (blob) {
            onDetectFrame(blob);
          }
        }
      }, liveIntervalMs);
    } else {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    }

    return () => {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
      }
    };
  }, [isLiveMode, isCameraActive, liveIntervalMs, isLoading, captureFrame, onDetectFrame]);

  const toggleLiveMode = () => {
    if (!isCameraActive) return;
    setIsLiveMode(prev => !prev);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-500" />
            Webcam Object Detection
          </h2>
          <p className="text-xs text-slate-400">Stream camera feed and run YOLO object detection on frames</p>
        </div>

        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Start Camera
            </button>
          ) : (
            <button
              onClick={() => {
                setIsLiveMode(false);
                stopCamera();
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/20 transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              Stop Camera
            </button>
          )}

          {onClearResult && (
            <button
              onClick={onClearResult}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700/60 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Camera Stream Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-dark-900 border border-slate-800 aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
        />

        {!isCameraActive && (
          <div className="text-center p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
              <CameraOff className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">Camera is turned off</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click "Start Camera" to enable your webcam and begin detecting objects in real time.
            </p>
          </div>
        )}

        {/* Live Indicator Badge */}
        {isCameraActive && (
          <div className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700/80 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse glow-emerald"></span>
            <span className="text-emerald-400">LIVE FEED</span>
            {isLiveMode && (
              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 text-[10px] font-bold">
                AUTO ({liveIntervalMs}ms)
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2">
          <div className="flex items-center gap-3 font-semibold text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <div className="pl-8 text-[11px] text-slate-300 space-y-1">
            <p><strong>Quick Fix Checklist:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Browser Permission:</strong> Click the lock/tune icon next to <code>http://localhost:5173</code> in your address bar and set <em>Camera</em> to <strong>Allow</strong>, then refresh.</li>
              <li><strong>Windows Privacy Settings:</strong> Open Windows Settings &rarr; <em>Privacy & Security</em> &rarr; <em>Camera</em> &rarr; Turn ON <em>"Let apps access your camera"</em> and <em>"Let desktop apps access your camera"</em>.</li>
              <li><strong>Camera Lock:</strong> Close Zoom, Teams, Skype, or Windows Camera app if they are running.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Action Controls */}
      {isCameraActive && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCaptureAndDetect}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-lg transition-all flex items-center gap-2 ${
                isLoading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/25 active:scale-95'
              }`}
            >
              <Radio className="w-4 h-4 text-brand-300" />
              Capture & Detect Frame
            </button>
          </div>

          {/* Live Detection Options */}
          <div className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={toggleLiveMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isLiveMode
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isLiveMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isLiveMode ? 'Pause Live' : 'Live Detection'}
            </button>

            <select
              value={liveIntervalMs}
              onChange={(e) => setLiveIntervalMs(Number(e.target.value))}
              className="bg-slate-900 text-xs text-slate-300 px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value={500}>500 ms</option>
              <option value={1000}>1 sec</option>
              <option value={2000}>2 sec</option>
            </select>
          </div>
        </div>
      )}

    </div>
  );
};

export default WebcamCard;
