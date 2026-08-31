import React, { useState } from 'react';
import WebcamCard from '../components/WebcamCard';
import ConfidenceSlider from '../components/ConfidenceSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DetectionResult from '../components/DetectionResult';
import DetectionStats from '../components/DetectionStats';
import DetectionTable from '../components/DetectionTable';
import { detectObjects } from '../services/api';

const WebcamDetection = () => {
  const [confidence, setConfidence] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [liveDetection, setLiveDetection] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleDetectFrame = async (base64Frame) => {
    setCapturedImage(base64Frame);
    if (!liveDetection) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await detectObjects({ image: base64Frame }, false, confidence / 100);
      if (data && data.success) {
        setResult(data);
      } else {
        setError(data?.error || 'Detection failed.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with YOLO backend server.');
    } finally {
      if (!liveDetection) {
        setIsLoading(false);
      }
    }
  };

  const isNoDetections = result && result.success && result.count === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
          Webcam Object Detection
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Capture frames from your webcam or enable live stream detection to run real-time YOLO inference.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Camera View & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <WebcamCard
            onDetectFrame={handleDetectFrame}
            isLoading={isLoading}
            liveDetection={liveDetection}
            setLiveDetection={setLiveDetection}
          />

          <ConfidenceSlider
            value={confidence}
            onChange={setConfidence}
            disabled={isLoading || liveDetection}
          />
        </div>

        {/* Right Column: Results, Stats & Table */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading && !liveDetection && (
            <LoadingSpinner message="Running YOLO inference on captured frame..." />
          )}

          {error && <ErrorMessage message={error} />}

          {isNoDetections && <ErrorMessage isEmpty={true} />}

          {result && result.success && (
            <>
              <DetectionStats statistics={result.statistics} />

              <DetectionResult
                originalImage={result.original_image || capturedImage}
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
                Start your camera on the left panel and click <span className="text-cyan-400 font-medium">Capture & Detect</span> to capture a frame.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamDetection;
