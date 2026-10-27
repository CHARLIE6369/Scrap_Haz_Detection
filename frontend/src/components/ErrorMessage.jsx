import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-200 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Detection Failed</h4>
          <p className="text-xs text-rose-300/90">{error}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
