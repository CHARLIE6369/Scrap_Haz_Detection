import React from 'react';
import { Loader2, Scan } from 'lucide-react';

const LoadingSpinner = ({ message = 'Detecting objects...' }) => {
  return (
    <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 my-4 animate-pulse-slow">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Scan className="w-8 h-8 animate-pulse" />
        </div>
        <Loader2 className="w-20 h-20 text-indigo-500 animate-spin absolute -top-2 -left-2 opacity-80" />
      </div>

      <div>
        <h4 className="font-heading font-semibold text-lg text-white">{message}</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          Processing image with Ultralytics YOLO model. Bounding boxes & confidence metrics will appear shortly.
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
