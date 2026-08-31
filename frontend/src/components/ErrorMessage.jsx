import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, isEmpty = false }) => {
  if (!message && !isEmpty) return null;

  if (isEmpty) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-950/20 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-heading font-semibold text-base text-amber-200">No Objects Detected</h4>
          <p className="text-xs text-amber-300/80 mt-1">
            YOLO could not find any matching object bounding boxes above the chosen confidence threshold.
          </p>
          <p className="text-xs text-amber-400 font-medium mt-2">
            Tip: Try lowering the confidence threshold slider (e.g. to 25% or 30%).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-rose-950/30 flex items-start space-x-3.5 my-4">
      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-heading font-semibold text-sm text-rose-200">Error Encountered</h4>
        <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium border border-rose-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
