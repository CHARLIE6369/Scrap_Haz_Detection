import React from 'react';
import { Loader2, Scan } from 'lucide-react';

const LoadingSpinner = ({ message = "Detecting objects using YOLO model..." }) => {
  return (
    <div className="glass-panel p-8 rounded-2xl border border-brand-500/30 text-center flex flex-col items-center justify-center space-y-4 shadow-xl glow-blue">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
          <Scan className="w-7 h-7 animate-pulse" />
        </div>
        <Loader2 className="w-16 h-16 text-brand-500 animate-spin absolute -top-1 -left-1" />
      </div>
      <div>
        <h4 className="text-base font-bold text-white tracking-wide">{message}</h4>
        <p className="text-xs text-slate-400 mt-1">Extracting features and generating bounding boxes</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
