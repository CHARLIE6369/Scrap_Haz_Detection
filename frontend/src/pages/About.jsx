import React, { useEffect, useState } from 'react';
import { Cpu, Server, Globe, FileText, CheckCircle2, AlertCircle, Database, Layers } from 'lucide-react';
import { getModelInfo } from '../services/api';

const About = () => {
  const [modelMetadata, setModelMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      const res = await getModelInfo();
      if (res && res.success) {
        setModelMetadata(res);
      }
      setLoading(false);
    };
    fetchInfo();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System & Architecture Documentation</h1>
        <p className="text-sm text-slate-400">Detailed breakdown of the YOLO object detection model, REST API, and frontend structure</p>
      </div>

      {/* Model Metadata Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-500" />
          Active YOLO Model Configuration
        </h2>

        {loading ? (
          <p className="text-xs text-slate-400">Loading model metadata...</p>
        ) : modelMetadata && modelMetadata.model_loaded ? (
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Loaded Weight File</p>
              <p className="text-sm font-bold text-white mt-1 font-mono">{modelMetadata.model_path || 'best.pt'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Total Trained Classes</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">{modelMetadata.class_count}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400">Model Status</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-1">
                <CheckCircle2 className="w-4 h-4" /> Ready for Inference
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            YOLO model weights are missing or failed to initialize. Please verify `best.pt` exists in `backend/models/`.
          </div>
        )}

        {modelMetadata && modelMetadata.class_names && (
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">Class Index Mapping</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(modelMetadata.class_names).map(([id, name]) => (
                <span
                  key={id}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium"
                >
                  <strong className="text-brand-400">ID {id}:</strong> {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Architecture Diagram */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-500" />
          Decoupled Client-Server Flow
        </h2>

        <div className="p-6 rounded-xl bg-dark-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{`
  +-----------------------+              +-----------------------+
  |  React 18 + Vite UI   |              |   Flask Python API    |
  | (Netlify Deployable)  | --(HTTP)-->  |   (REST Endpoint)     |
  +-----------------------+              +-----------------------+
              |                                      |
              v                                      v
  Image Upload / Webcam                   Ultralytics YOLO
  MediaStream Blob Capture                 Model (best.pt)
              |                                      |
              +<--(Annotated B64 + BBoxes JSON)-----+
          `}</pre>
        </div>
      </div>

      {/* Technical Stack Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-brand-500" />
            <h3 className="text-base font-bold text-white">Frontend Architecture</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>React 18 with Vite fast build tooling</li>
            <li>Tailwind CSS custom glassmorphism design system</li>
            <li>Lucide React icon library</li>
            <li>Canvas frame rendering & MediaDevices getUserMedia API</li>
            <li>Decoupled API client configured with VITE_API_URL</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Backend Architecture</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Flask Python microframework & Flask-CORS</li>
            <li>Ultralytics YOLO single-instance startup loading</li>
            <li>OpenCV & Pillow EXIF auto-rotation handling</li>
            <li>Base64 encoded JPEG buffer response pipeline</li>
            <li>Strict file validation & 10MB payload size restriction</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default About;
