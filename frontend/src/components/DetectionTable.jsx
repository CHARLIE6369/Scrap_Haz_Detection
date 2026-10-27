import React from 'react';
import { Table, Box, Hash, Percent } from 'lucide-react';

const DetectionTable = ({ detections }) => {
  if (!detections || detections.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Table className="w-5 h-5 text-brand-500" />
          Detected Objects List
        </h3>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
          {detections.length} item{detections.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Object / Class</th>
              <th className="px-4 py-3 text-right">Confidence</th>
              <th className="px-4 py-3 text-center">X1</th>
              <th className="px-4 py-3 text-center">Y1</th>
              <th className="px-4 py-3 text-center">X2</th>
              <th className="px-4 py-3 text-center">Y2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-medium">
            {detections.map((item, index) => {
              const confPct = item.confidence_pct || (item.confidence * 100).toFixed(1);
              const bbox = item.bbox || { x1: '-', y1: '-', x2: '-', y2: '-' };
              
              // Custom class colors
              const isClass0 = item.class_id === 0;
              const badgeClass = isClass0
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                : 'bg-orange-500/15 text-orange-400 border-orange-500/30';

              return (
                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${badgeClass}`}>
                      <Box className="w-3.5 h-3.5" />
                      {item.class_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">
                    {confPct}%
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300 font-mono">{bbox.x1}</td>
                  <td className="px-4 py-3 text-center text-slate-300 font-mono">{bbox.y1}</td>
                  <td className="px-4 py-3 text-center text-slate-300 font-mono">{bbox.x2}</td>
                  <td className="px-4 py-3 text-center text-slate-300 font-mono">{bbox.y2}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetectionTable;
