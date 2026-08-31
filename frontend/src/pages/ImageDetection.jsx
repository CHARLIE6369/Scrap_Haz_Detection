import React, { useState } from 'react';
import UploadCard from '../components/UploadCard';
import ConfidenceSlider from '../components/ConfidenceSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DetectionResult from '../components/DetectionResult';
import DetectionStats from '../components/DetectionStats';
import DetectionTable from '../components/DetectionTable';
import { detectObjects } from '../services/api';

const ImageDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidence, setConfidence] = useState(50); // percentage 0-100
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('confidence', (confidence / 100).toString());

    try {
      const data = await detectObjects(formData, true, confidence / 100);
      if (data && data.success) {
        setResult(data);
      } else {
        setError(data?.error || 'Detection failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to the YOLO backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const isNoDetections = result && result.success && result.count === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
          Image Object Detection
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Upload an image file to run YOLO object detection and view bounding boxes & statistical breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <UploadCard
            onFileSelected={handleFileSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onClear={handleClear}
            onDetect={handleDetect}
            isLoading={isLoading}
          />

          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            disabled={isLoading}
          />
        </div>

        {/* Right Column: Loading, Results & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading && <LoadingSpinner message="Detecting objects in uploaded image..." />}

          {error && <ErrorMessage message={error} onRetry={handleDetect} />}

          {isNoDetections && <ErrorMessage isEmpty={true} />}

          {result && result.success && (
            <>
              <DetectionStats statistics={result.statistics} />

              <DetectionResult
                originalImage={result.original_image || previewUrl}
                annotatedImage={result.annotated_image}
                detectionsCount={result.count}
                resultData={result}
              />

              <DetectionTable detections={result.detections} />
            </>
          )}

          {!isLoading && !result && !error && (
            <div className="glass-card rounded-2xl p-12 text-center border-dashed border-2 border-gray-800">
              <p className="text-gray-400 text-sm">
                Select an image on the left panel and click <span className="text-indigo-400 font-medium">Run YOLO Detection</span> to display predictions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetection;
