import React from 'react';
import { Table, Box } from 'lucide-react';

const DetectionTable = ({ detections = [] }) => {
  if (!detections || detections.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
          <Table className="w-6 h-6" />
        </div>
        <h4 className="font-heading font-medium text-gray-300">No Object Detections</h4>
        <p className="text-xs text-gray-500 mt-1">
          Detection objects table will appear here once inference runs.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Table className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-base text-white">Detection Details</h3>
          <p className="text-xs text-gray-400">Parsed object classes, confidence, and bounding box coordinates</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-950/40">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Object Class</th>
              <th className="py-3 px-4 text-right">Confidence</th>
              <th className="py-3 px-4 text-center">X1</th>
              <th className="py-3 px-4 text-center">Y1</th>
              <th className="py-3 px-4 text-center">X2</th>
              <th className="py-3 px-4 text-center">Y2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {detections.map((det, idx) => {
              const bbox = det.bbox || {};
              const confPercent = det.confidence_percent || (det.confidence * 100).toFixed(1);

              return (
                <tr
                  key={idx}
                  className="hover:bg-indigo-950/20 transition-colors group"
                >
                  <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-white flex items-center space-x-2">
                    <Box className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="capitalize">{det.class_name}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded ${
                        Number(confPercent) > 80
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : Number(confPercent) > 50
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {confPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">{bbox.x1 ?? '-'}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{bbox.y1 ?? '-'}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{bbox.x2 ?? '-'}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{bbox.y2 ?? '-'}</td>
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
