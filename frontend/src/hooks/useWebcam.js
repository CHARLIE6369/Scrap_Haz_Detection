import { useState, useRef, useCallback, useEffect } from 'react';

export const useWebcam = () => {
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser or context. Make sure you access the app via http://localhost:5173 or http://127.0.0.1:5173.');
      }
      
      let mediaStream = null;

      // Attempt 1: Ideal HD Resolution
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (hdErr) {
        console.warn('HD camera constraints failed, trying basic video:true fallback...', hdErr);
        // Attempt 2: Basic video true fallback
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.warn('Autoplay prevented:', e));
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      let errMsg = 'Failed to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Camera permission was denied in your browser or Windows Privacy Settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'No webcam device detected on your computer.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errMsg = 'Camera is already in use by another application (e.g. Zoom, Teams, Skype, or Windows Camera app).';
      } else if (err.name === 'OverconstrainedError') {
        errMsg = 'Webcam does not satisfy resolution constraints.';
      }
      setError(errMsg);
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, [stream]);

  // Capture current video frame to JPEG Blob
  const captureFrame = useCallback(() => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      if (!video || !isCameraActive) {
        console.warn('captureFrame failed: Camera is not active.');
        resolve(null);
        return;
      }

      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;

      if (width === 0 || height === 0) {
        console.warn('captureFrame failed: Video width or height is 0.');
        resolve(null);
        return;
      }

      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('captureFrame failed: Unable to get 2d canvas context.');
        resolve(null);
        return;
      }

      try {
        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.warn('captureFrame failed: canvas.toBlob returned null.');
            } else {
              console.log(`captureFrame success: captured frame ${blob.size} bytes (${width}x${height})`);
            }
            resolve(blob);
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        console.error('captureFrame error during drawImage:', err);
        resolve(null);
      }
    });
  }, [isCameraActive]);

  // Cleanup camera stream automatically on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    isCameraActive,
    error,
    startCamera,
    stopCamera,
    captureFrame
  };
};
