import { useState, useRef, useCallback, useEffect } from 'react';

export const useWebcam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Fetch available video input devices
  const getDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        const defaultDev = videoDevices.find((d) => d.deviceId) || videoDevices[0];
        if (defaultDev && defaultDev.deviceId) {
          setSelectedDeviceId(defaultDev.deviceId);
        }
      }
    } catch (err) {
      console.warn('Error fetching media devices:', err);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  // Ensure streamRef stays updated
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Bind mediaStream to videoRef element
  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .then(() => setIsStreaming(true))
          .catch((err) => {
            console.warn('Video play error:', err);
          });
      } else {
        videoRef.current.srcObject = null;
        setIsStreaming(false);
      }
    }
  }, [stream]);

  // Stop camera tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsStreaming(false);
  }, []);

  // Start camera with requested device
  const startCamera = useCallback(async (deviceId) => {
    // Stop any existing tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setError(null);

    const targetId = deviceId || selectedDeviceId;
    // Use 'ideal' instead of 'exact' to prevent OverconstrainedError
    const constraints = {
      video: targetId ? { deviceId: { ideal: targetId }, width: { ideal: 1280 }, height: { ideal: 720 } } : true,
      audio: false,
    };

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API (getUserMedia) is not supported in this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsStreaming(true);

      // Refresh devices in case labels were restricted prior to permission
      getDevices();
    } catch (err) {
      console.error('Camera access error:', err);
      let userMsg = 'Failed to access webcam. Please check browser permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMsg = 'Webcam permission denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMsg = 'No webcam device found on your system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userMsg = 'Webcam is currently in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        userMsg = 'Requested webcam resolution or device is not supported.';
      }
      setError(userMsg);
      setIsStreaming(false);
    }
  }, [selectedDeviceId, getDevices]);

  // Capture frame from active video stream as base64 data URI
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || (!isStreaming && !streamRef.current)) {
      setError('Camera is not active. Please click "Start Camera" first.');
      return null;
    }

    const width = video.videoWidth || video.clientWidth || 640;
    const height = video.videoHeight || video.clientHeight || 480;

    if (width === 0 || height === 0) {
      setError('Video stream frame not ready yet. Please wait a moment.');
      return null;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    // Return base64 JPEG
    return canvas.toDataURL('image/jpeg', 0.92);
  }, [isStreaming]);

  // Cleanup tracks on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCamera,
    stopCamera,
    captureFrame,
    setError,
  };
};

export default useWebcam;
