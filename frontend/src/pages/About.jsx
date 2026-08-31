import React, { useEffect, useState } from 'react';
import { Cpu, Server, Globe, CheckCircle2, AlertCircle, Layers, Database, Shield } from 'lucide-react';
import { getModelInfo } from '../services/api';

const About = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getModelInfo();
        setModelInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      <div>
        <h1 className="font-heading font-bold text-3xl text-white">About YOLO Vision Web Application</h1>
        <p className="text-gray-400 text-sm mt-1">
          Full-stack computer vision application powered by React, Vite, Flask, and Ultralytics YOLO.
        </p>
      </div>

      {/* Model Metadata Card */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-white">Loaded Model Information</h3>
            <p className="text-xs text-gray-400">Dynamically queried from backend <code className="text-indigo-300">/api/model-info</code></p>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-gray-400 font-mono animate-pulse">Fetching model specifications...</p>
        ) : error ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : modelInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 uppercase font-mono tracking-wider">Model Status</span>
              <div className="mt-1 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-heading font-bold text-base text-emerald-300">Active / Loaded</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 uppercase font-mono tracking-wider">Model File</span>
              <p className="mt-1 font-mono font-semibold text-sm text-indigo-300">{modelInfo.model_name || 'best.pt'}</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800">
              <span className="text-[11px] text-gray-400 uppercase font-mono tracking-wider">Total Classes</span>
              <p className="mt-1 font-heading font-bold text-xl text-white">{modelInfo.num_classes || 0}</p>
            </div>

            {/* Dynamic Class Labels */}
            {modelInfo.class_names && (
              <div className="sm:col-span-3 p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
                <span className="text-xs text-gray-400 font-mono font-medium">Model Detectable Classes:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(modelInfo.class_names).map(([id, className]) => (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold"
                    >
                      ID {id}: {className}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* System Architecture */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-white">Application Architecture</h3>
            <p className="text-xs text-gray-400">Decoupled frontend & backend workflow</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 text-xs font-mono leading-relaxed text-gray-300 overflow-x-auto">
          <pre className="text-cyan-300">
{`React Frontend (Netlify / Localhost)
       │
       ▼ (REST API / CORS)
Flask Backend Server (http://127.0.0.1:5000)
       │
       ▼ (Singleton Engine)
Ultralytics YOLO Service (best.pt)
       │
       ▼
Base64 Annotated Overlay + Bounding Box Metadata`}
          </pre>
        </div>
      </div>

      {/* Deployment & Production Notes */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-3">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-white">Deployment Configuration</h3>
            <p className="text-xs text-gray-400">Netlify frontend & Python API hosting</p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-gray-300 leading-relaxed list-disc list-inside">
          <li>
            <strong className="text-white">Frontend:</strong> Built with Vite SPA mode, deployable directly to Netlify using build command <code className="text-indigo-300 font-mono">npm run build</code> and publish directory <code className="text-indigo-300 font-mono">dist</code>.
          </li>
          <li>
            <strong className="text-white">Environment API URL:</strong> Uses <code className="text-indigo-300 font-mono">VITE_API_URL</code> environment variable for production Python backend API routing.
          </li>
          <li>
            <strong className="text-white">Backend Hosting:</strong> Python Flask server with PyTorch/YOLO runs on localhost during development and should be deployed to a Python backend provider (e.g. Render, Railway, AWS EC2) for production.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
