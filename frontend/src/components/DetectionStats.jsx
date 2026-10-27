import React from 'react';
import { Target, Award, Layers, Zap } from 'lucide-react';

const DetectionStats = ({ stats }) => {
  if (!stats) return null;

  const { count = 0, highest_confidence_pct = 0, unique_classes_detected = 0, inference_time_ms = 0 } = stats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Objects Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Objects</p>
          <p className="text-2xl font-bold text-white tracking-tight">{count}</p>
        </div>
      </div>

      {/* Highest Confidence Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Top Confidence</p>
          <p className="text-2xl font-bold text-white tracking-tight">
            {count > 0 ? `${highest_confidence_pct}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Classes Detected Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Classes Found</p>
          <p className="text-2xl font-bold text-white tracking-tight">{unique_classes_detected}</p>
        </div>
      </div>

      {/* Inference Time Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Inference Time</p>
          <p className="text-2xl font-bold text-white tracking-tight">{inference_time_ms} ms</p>
        </div>
      </div>

    </div>
  );
};

export default DetectionStats;
