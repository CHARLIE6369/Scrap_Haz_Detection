import React from 'react';
import { Sliders } from 'lucide-react';

const ConfidenceSlider = ({ value, onChange, disabled }) => {
  // Value is percentage integer 0..100
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="font-heading font-medium text-sm text-gray-200">Confidence Threshold</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
          {value}%
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Quick preset buttons */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 text-[11px]">0% (All detections)</span>
          <div className="flex space-x-1">
            {[25, 50, 75].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                disabled={disabled}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  value === preset
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
          <span className="text-gray-500 text-[11px]">100% (Strict)</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
