import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Sparkles, ArrowRight, ShieldCheck, Cpu, Layers } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-4">
      {/* Hero Header Section */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ultralytics YOLO Real-Time Vision System</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
          YOLO <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">Object Detection</span> Web Application
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
          AI-powered real-time object detection using custom-trained YOLO models. Upload an image or use your webcam to detect bounding boxes, confidence scores, and statistics.
        </p>
      </div>

      {/* Feature Cards Grid (Prompt Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Card 1: Upload Image */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group border border-gray-800 hover:border-indigo-500/40 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all pointer-events-none"></div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>

            <h2 className="font-heading font-bold text-2xl text-white">Upload Image Detection</h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Upload an image from your computer (JPG, PNG, WEBP) and run instant YOLO object detection. View bounding boxes, confidence percentages, and parse exact coordinates.
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => navigate('/detect-image')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <span>Upload Image & Detect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Webcam Detection */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group border border-gray-800 hover:border-cyan-500/40 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-all pointer-events-none"></div>

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>

            <h2 className="font-heading font-bold text-2xl text-white">Webcam Real-Time Detection</h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Open your device's webcam to capture live frames or enable automatic interval detection mode. Detect objects directly from your live video stream.
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => navigate('/webcam')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-sm shadow-xl shadow-cyan-500/20 transition-all active:scale-[0.98]"
            >
              <span>Open Webcam Camera</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Highlights Banner */}
      <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-6 border border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white">Custom YOLO Weights</h4>
            <p className="text-xs text-gray-400 mt-0.5">Pre-loaded Ultralytics PyTorch model for high speed inference.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white">Dynamic Class Extraction</h4>
            <p className="text-xs text-gray-400 mt-0.5">Automatically resolves model classes without hardcoding.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white">Production Decoupled</h4>
            <p className="text-xs text-gray-400 mt-0.5">Frontend ready for Netlify SPA deployment with Python backend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
