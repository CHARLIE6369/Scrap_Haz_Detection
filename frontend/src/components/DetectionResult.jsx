import React, { useState } from 'react';
import { Eye, Layers, Maximize2, X, CheckCircle } from 'lucide-react';

const DetectionResult = ({ originalImage, annotatedImage, count, isLoading }) => {
  const [activeTab, setActiveTab] = useState('annotated'); // 'annotated' or 'original'
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!annotatedImage && !originalImage && !isLoading) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[320px]">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-center text-slate-500 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">No Detection Results Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Upload an image or capture a webcam frame to view YOLO annotated bounding boxes and confidence scores.
        </p>
      </div>
    );
  }

  const currentDisplayImage = activeTab === 'annotated' ? (annotatedImage || originalImage) : originalImage;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      
      {/* Header & Mode Tabs */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-500" />
          Detection Output
        </h3>

        {annotatedImage && (
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('annotated')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'annotated'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              YOLO Result
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'original'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original Image
            </button>
          </div>
        )}
      </div>

      {/* Main Image Display Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-dark-900 border border-slate-800 min-h-[360px] flex items-center justify-center group">
        {currentDisplayImage && (
          <>
            <img
              src={currentDisplayImage}
              alt="YOLO Detection Output"
              className="max-h-[480px] w-auto object-contain rounded-xl"
            />

            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-dark-900/80 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              title="Expand image view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {count === 0 && activeTab === 'annotated' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-xs font-medium shadow-lg">
                No objects detected. Try lowering the confidence threshold slider.
              </div>
            )}
          </>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && currentDisplayImage && (
        <div className="fixed inset-0 z-50 bg-dark-900/90 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-xl"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentDisplayImage}
            alt="YOLO Detection Expanded View"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-slate-800"
          />
        </div>
      )}

    </div>
  );
};

export default DetectionResult;
