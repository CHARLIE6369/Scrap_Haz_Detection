import React, { useState } from 'react';
import UploadCard from '../components/UploadCard';
import ConfidenceSlider from '../components/ConfidenceSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DetectionStats from '../components/DetectionStats';
import DetectionResult from '../components/DetectionResult';
import DetectionTable from '../components/DetectionTable';
import { detectObjects } from '../services/api';

const ImageDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confidence, setConfidence] = useState(0.25);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectionData, setDetectionData] = useState(null);

  const handleRunDetection = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await detectObjects(selectedFile, confidence);

      if (response && response.success) {
        setDetectionData(response);
      } else {
        setError(response.error || 'Failed to detect objects. Please try again.');
        setDetectionData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach the YOLO backend. Make sure the Flask server is running.');
      setDetectionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Image Object Detection</h1>
        <p className="text-sm text-slate-400 mt-1">Upload an image file to run YOLO inference and extract detected objects</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload & Threshold Controls */}
        <div className="lg:col-span-5 space-y-6">
          <UploadCard
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            onDetect={handleRunDetection}
            isLoading={isLoading}
          />

          <ConfidenceSlider
            confidence={confidence}
            setConfidence={setConfidence}
            disabled={isLoading}
          />
        </div>

        {/* Right Column: Output & Detailed Metrics */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading && <LoadingSpinner message="Running YOLO inference on uploaded image..." />}

          {error && <ErrorMessage error={error} onRetry={handleRunDetection} />}

          {detectionData && (
            <>
              <DetectionStats stats={detectionData} />
              
              <DetectionResult
                originalImage={imagePreview}
                annotatedImage={detectionData.annotated_image}
                count={detectionData.count}
                isLoading={isLoading}
              />

              <DetectionTable detections={detectionData.detections} />
            </>
          )}

          {!isLoading && !error && !detectionData && (
            <DetectionResult
              originalImage={imagePreview}
              annotatedImage={null}
              count={0}
              isLoading={false}
            />
          )}
        </div>

      </div>

    </div>
  );
};

export default ImageDetection;
