import React, { useState } from 'react';
import { Eye, Layers, Maximize2, X, Download, CheckCircle, Info } from 'lucide-react';

const DetectionResult = ({ originalImage, annotatedImage, detectionsCount, resultData }) => {
  const [activeTab, setActiveTab] = useState('annotated'); // 'annotated' | 'original' | 'split'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!annotatedImage && !originalImage) return null;

  const openFullscreen = (imgSrc) => {
    setFullscreenImage(imgSrc);
    setIsFullscreen(true);
  };

  const downloadImage = (imgSrc, filename = 'yolo_detection_result.jpg') => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading font-semibold text-lg text-white flex items-center space-x-2">
            <span>Detection Result</span>
            {detectionsCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {detectionsCount} {detectionsCount === 1 ? 'Object' : 'Objects'} Detected
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400">
                No Objects Detected
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400">YOLO annotated image with bounding boxes & confidence scores</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab('annotated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'annotated'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Annotated Result
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'original'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`hidden sm:block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-medium px-1 flex items-center justify-between">
              <span>Original Source</span>
            </div>
            <div className="relative group rounded-xl overflow-hidden bg-black/60 border border-gray-800 aspect-video flex items-center justify-center">
              <img
                src={originalImage}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => openFullscreen(originalImage)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Annotated */}
          <div className="space-y-2">
            <div className="text-xs text-indigo-300 font-medium px-1 flex items-center justify-between">
              <span>YOLO Annotated Result</span>
            </div>
            <div className="relative group rounded-xl overflow-hidden bg-black/60 border border-gray-800 aspect-video flex items-center justify-center">
              <img
                src={annotatedImage}
                alt="Annotated"
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-2 right-2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => downloadImage(annotatedImage)}
                  className="p-1.5 rounded-lg bg-black/70 text-gray-300 hover:text-white"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openFullscreen(annotatedImage)}
                  className="p-1.5 rounded-lg bg-black/70 text-gray-300 hover:text-white"
                  title="Fullscreen View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden bg-black/60 border border-gray-800 min-h-[300px] max-h-[500px] flex items-center justify-center">
          <img
            src={activeTab === 'annotated' ? annotatedImage : originalImage}
            alt={activeTab === 'annotated' ? 'YOLO Annotated Result' : 'Original Image'}
            className="max-h-[480px] max-w-full object-contain"
          />

          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => downloadImage(activeTab === 'annotated' ? annotatedImage : originalImage)}
              className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-gray-700 text-gray-200 hover:text-white transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => openFullscreen(activeTab === 'annotated' ? annotatedImage : originalImage)}
              className="p-2 rounded-xl bg-black/70 backdrop-blur-md border border-gray-700 text-gray-200 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-gray-700 text-xs font-mono text-gray-300">
            {activeTab === 'annotated' ? 'YOLO v8 Inference Overlay' : 'Original Frame'}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 text-gray-200 hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default DetectionResult;
