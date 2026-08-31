import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Video, Sparkles, AlertCircle, Play } from 'lucide-react';
import useWebcam from '../hooks/useWebcam';

const WebcamCard = ({ onDetectFrame, isLoading, liveDetection, setLiveDetection }) => {
  const {
    videoRef,
    isStreaming,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCamera,
    stopCamera,
    captureFrame,
  } = useWebcam();

  const [liveIntervalMs, setLiveIntervalMs] = useState(1000);
  const liveIntervalRef = useRef(null);

  // Stop live detection when camera stops
  useEffect(() => {
    if (!isStreaming && liveDetection) {
      setLiveDetection(false);
    }
  }, [isStreaming, liveDetection, setLiveDetection]);

  // Live detection interval effect
  useEffect(() => {
    if (liveDetection && isStreaming && !isLoading) {
      liveIntervalRef.current = setInterval(() => {
        const frameB64 = captureFrame();
        if (frameB64) {
          onDetectFrame(frameB64);
        }
      }, liveIntervalMs);
    } else {
      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current);
      }
    }

    return () => {
      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current);
      }
    };
  }, [liveDetection, isStreaming, isLoading, liveIntervalMs, captureFrame, onDetectFrame]);

  const handleCaptureAndDetect = () => {
    const frameB64 = captureFrame();
    if (frameB64) {
      onDetectFrame(frameB64);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-white">Webcam Detection</h3>
            <p className="text-xs text-gray-400">Capture frames or stream live to detect objects</p>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex items-center space-x-2">
          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                startCamera(e.target.value);
              }}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {devices.map((device, idx) => (
                <option key={device.deviceId || idx} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          {!isStreaming ? (
            <button
              onClick={() => startCamera()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium text-xs transition-all active:scale-95"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Display Container */}
      <div className="relative rounded-xl overflow-hidden bg-black/60 border border-gray-800 aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-contain ${!isStreaming ? 'hidden' : 'block'}`}
        />

        {!isStreaming && (
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
              <CameraOff className="w-8 h-8" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Camera is offline</p>
            <p className="text-gray-500 text-xs mt-1">Click "Start Camera" to initialize your webcam stream</p>
          </div>
        )}

        {isStreaming && (
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons & Controls */}
      {isStreaming && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCaptureAndDetect}
              disabled={isLoading || liveDetection}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-md ${
                isLoading || liveDetection
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-95'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Capture & Detect</span>
            </button>
          </div>

          {/* Optional Live Mode Toggle */}
          <div className="flex items-center space-x-4 bg-gray-900/80 px-3.5 py-1.5 rounded-xl border border-gray-800">
            <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={liveDetection}
                onChange={(e) => setLiveDetection(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-gray-800 border-gray-700"
              />
              <span className="font-medium flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Mode</span>
              </span>
            </label>

            {liveDetection && (
              <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                <span>Interval:</span>
                <select
                  value={liveIntervalMs}
                  onChange={(e) => setLiveIntervalMs(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 text-gray-200 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                >
                  <option value={500}>500 ms</option>
                  <option value={1000}>1000 ms</option>
                  <option value={2000}>2000 ms</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCard;
