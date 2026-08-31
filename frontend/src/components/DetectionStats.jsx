import React from 'react';
import { Target, Award, Grid, Zap } from 'lucide-react';

const DetectionStats = ({ statistics }) => {
  if (!statistics) return null;

  const {
    total_objects = 0,
    highest_confidence = 0,
    classes_detected = 0,
    inference_time_ms = 0,
  } = statistics;

  const statsList = [
    {
      id: 'total',
      label: 'Total Objects',
      value: total_objects,
      suffix: '',
      icon: Target,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 'confidence',
      label: 'Highest Confidence',
      value: highest_confidence > 0 ? `${highest_confidence.toFixed(1)}%` : 'N/A',
      suffix: '',
      icon: Award,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'classes',
      label: 'Classes Detected',
      value: classes_detected,
      suffix: '',
      icon: Grid,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      id: 'time',
      label: 'Inference Time',
      value: inference_time_ms,
      suffix: ' ms',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsList.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className={`glass-card rounded-2xl p-4 border bg-gradient-to-br ${stat.color} flex items-center space-x-3.5`}
          >
            <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 shadow-inner">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <h4 className="font-heading font-extrabold text-xl text-white tracking-tight mt-0.5">
                {stat.value}
                <span className="text-xs font-normal text-gray-400">{stat.suffix}</span>
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetectionStats;
