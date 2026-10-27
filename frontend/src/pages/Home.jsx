import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Camera, ArrowRight, ShieldCheck, Cpu, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Powered by Ultralytics YOLO & Flask
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          YOLO Object Detection <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-500 via-brand-accent to-emerald-400 bg-clip-text text-transparent">
            AI Dashboard
          </span>
        </h1>

        <p className="text-base text-slate-400 leading-relaxed">
          Upload an image or use your webcam to detect objects, visualize bounding boxes, analyze confidence scores, and view comprehensive inference metrics in real time.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Card 1: Upload Image */}
        <div className="glass-card p-8 rounded-3xl space-y-6 transition-all duration-300 group hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white group-hover:text-brand-400 transition-colors">
              Image Upload Detection
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload local JPG, PNG, or WEBP images to run object detection. Supports custom confidence thresholds, bounding box overlays, and exportable detection statistics.
            </p>
          </div>

          <Link
            to="/image-detection"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all group-hover:shadow-brand-500/40"
          >
            Upload Image & Detect
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Webcam Detection */}
        <div className="glass-card p-8 rounded-3xl space-y-6 transition-all duration-300 group hover:-translate-y-1">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              Webcam Detection
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stream live webcam feed from your browser. Capture individual frames or activate live auto-detection mode with configurable polling intervals.
            </p>
          </div>

          <Link
            to="/webcam-detection"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all group-hover:shadow-emerald-500/40"
          >
            Open Webcam & Detect
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Dynamic Model Loading</h4>
            <p className="text-[11px] text-slate-400">Class names parsed dynamically from weights</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sub-Second CPU Inference</h4>
            <p className="text-[11px] text-slate-400">Optimized for lightweight local hosting</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Netlify Ready Architecture</h4>
            <p className="text-[11px] text-slate-400">Decoupled frontend & Python REST API</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
