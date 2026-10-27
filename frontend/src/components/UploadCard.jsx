import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertTriangle, FileCheck } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const UploadCard = ({ selectedFile, setSelectedFile, imagePreview, setImagePreview, onDetect, isLoading }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const validateAndSetFile = (file) => {
    setValidationError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setValidationError('Invalid file format. Please upload JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-500" />
            Upload Image
          </h2>
          <p className="text-xs text-slate-400">Select an image (JPG, PNG, WEBP, up to 10MB) for YOLO inference</p>
        </div>

        {selectedFile && (
          <button
            onClick={clearSelection}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-rose-500/10 rounded-lg transition-colors border border-slate-700/60"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Upload Drop Zone / Image Preview */}
      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] ${
            isDragOver
              ? 'border-brand-500 bg-brand-500/10 scale-[0.99]'
              : 'border-slate-700/80 hover:border-brand-500/60 bg-dark-800/40 hover:bg-dark-800/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-semibold text-slate-200 mb-1">
            Drag & Drop your image here
          </h3>
          <p className="text-xs text-slate-400 mb-4">or click to browse from your computer</p>

          <span className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 transition-all">
            Browse File
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-slate-800 max-h-[360px] flex items-center justify-center group">
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="max-h-[360px] w-auto object-contain rounded-xl"
            />
            <div className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              {selectedFile?.name} ({(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          </div>

          <button
            onClick={onDetect}
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 to-brand-accent text-white hover:opacity-95 shadow-brand-500/25 active:scale-[0.99]'
            }`}
          >
            {isLoading ? 'Processing YOLO Model...' : 'Run YOLO Object Detection'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
