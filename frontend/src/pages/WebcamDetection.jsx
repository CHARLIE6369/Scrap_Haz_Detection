import React, { useState, useCallback } from 'react';
import WebcamCard from '../components/WebcamCard';
import ConfidenceSlider from '../components/ConfidenceSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DetectionStats from '../components/DetectionStats';
import DetectionResult from '../components/DetectionResult';
import DetectionTable from '../components/DetectionTable';
import { detectObjects } from '../services/api';

const WebcamDetection = () => {
  const [confidence, setConfidence] = useState(0.3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedFrameUrl, setCapturedFrameUrl] = useState(null);
  const [detectionData, setDetectionData] = useState(null);

  const handleDetectFrame = useCallback(async (blob) => {
    if (!blob) return;

    // Create local object URL for original captured frame
    const frameUrl = URL.createObjectURL(blob);
    setCapturedFrameUrl(frameUrl);

    setIsLoading(true);
    setError(null);

    try {
      const response = await detectObjects(blob, confidence);

      if (response && response.success) {
        setDetectionData(response);
      } else {
        setError(response.error || 'Webcam frame detection failed.');
        setDetectionData(null);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to Flask backend.');
      setDetectionData(null);
    } finally {
      setIsLoading(false);
    }
  }, [confidence]);

  const handleClear = () => {
    setCapturedFrameUrl(null);
    setDetectionData(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Webcam Object Detection</h1>
        <p className="text-sm text-slate-400 mt-1">Capture webcam frames or run live auto-detection with custom YOLO thresholding</p>
        <div className="mt-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex items-center gap-2">
          <span>💡 <strong>Tip:</strong> Point your camera at a <strong>Gas Cylinder</strong> or <strong>Shock Absorber</strong> (or hold up an image on your phone/paper) to see live YOLO detections!</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Webcam Viewer & Threshold */}
        <div className="lg:col-span-6 space-y-6">
          <WebcamCard
            onDetectFrame={handleDetectFrame}
            isLoading={isLoading}
            onClearResult={handleClear}
          />

          <ConfidenceSlider
            confidence={confidence}
            setConfidence={setConfidence}
            disabled={isLoading}
          />
        </div>

        {/* Right Column: Output Results & Table */}
        <div className="lg:col-span-6 space-y-6">
          {isLoading && <LoadingSpinner message="Detecting objects in webcam frame..." />}

          {error && <ErrorMessage error={error} onRetry={null} />}

          {detectionData && (
            <>
              <DetectionStats stats={detectionData} />
              
              <DetectionResult
                originalImage={capturedFrameUrl}
                annotatedImage={detectionData.annotated_image}
                count={detectionData.count}
                isLoading={isLoading}
              />

              <DetectionTable detections={detectionData.detections} />
            </>
          )}

          {!isLoading && !error && !detectionData && (
            <DetectionResult
              originalImage={null}
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

export default WebcamDetection;
