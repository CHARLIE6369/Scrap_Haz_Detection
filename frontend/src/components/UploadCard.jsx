import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertTriangle, Play } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_SIZE_MB = 10;

const UploadCard = ({ onFileSelected, selectedFile, previewUrl, onClear, onDetect, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndPassFile = (file) => {
    setValidationError(null);
    if (!file) return;

    // Extension check
    const fileName = file.name.toLowerCase();
    const isValidExt = ALLOWED_EXTS.some((ext) => fileName.endsWith(ext));
    if (!isValidExt) {
      setValidationError('Please upload a valid JPG, PNG, JPEG, or WEBP image.');
      return;
    }

    // Size check
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`Maximum file size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    onFileSelected(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndPassFile(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-white">Upload Image</h3>
            <p className="text-xs text-gray-400">Select a local image file to run YOLO inference</p>
          </div>
        </div>

        {selectedFile && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Clear Image"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Upload Zone / Preview */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-indigo-400 bg-indigo-500/10 scale-[0.99]'
              : 'border-gray-700/80 hover:border-indigo-500/50 hover:bg-gray-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-indigo-400 shadow-inner">
            <ImageIcon className="w-8 h-8" />
          </div>

          <h4 className="font-medium text-gray-200 mb-1">
            Drag & drop your image here, or <span className="text-indigo-400 underline underline-offset-2">browse</span>
          </h4>
          <p className="text-xs text-gray-400">
            Supports JPG, JPEG, PNG, WEBP (Max {MAX_SIZE_MB}MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-black/40 border border-gray-800 aspect-video flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-gray-700 text-[11px] text-gray-300 font-mono">
              {selectedFile?.name || 'Uploaded Image'}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            <button
              onClick={onDetect}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
                isLoading
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLoading ? 'Detecting objects...' : 'Run YOLO Detection'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
