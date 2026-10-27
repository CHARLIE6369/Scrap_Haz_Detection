import React from 'react';
import { Sliders } from 'lucide-react';

const ConfidenceSlider = ({ confidence, setConfidence, disabled = false }) => {
  const percentage = Math.round(confidence * 100);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-500" />
          Confidence Threshold
        </label>
        <span className="px-3 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 font-bold text-xs">
          {percentage}%
        </span>
      </div>

      <div className="space-y-1">
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.05"
          value={confidence}
          onChange={(e) => setConfidence(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none"
        />
        <div className="flex justify-between text-[11px] font-medium text-slate-500">
          <span>0% (All predictions)</span>
          <span>25% (Recommended)</span>
          <span>100% (Highest precision)</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
