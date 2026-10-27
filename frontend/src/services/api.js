import axios from 'axios';

// Resolve API Base URL: custom env var -> production Render backend -> local Flask backend
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running on Render/cloud domains, default to deployed Render backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://scrap-haz-detection.onrender.com';
  }
  return 'http://127.0.0.1:5000';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/**
  Check if backend server and model are healthy.
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      success: false,
      status: 'offline',
      model_loaded: false,
      error: error.message || 'Unable to connect to Flask backend.'
    };
  }
};

/**
  Fetch detailed model info and loaded class names.
 */
export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/api/model-info');
    return response.data;
  } catch (error) {
    console.error('Fetch model info failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch model metadata.'
    };
  }
};

/**
  Send image file/blob to backend POST /api/detect.
 */
export const detectObjects = async (fileOrBlob, confidence = 0.5) => {
  const formData = new FormData();
  
  // Set appropriate filename if blob or File
  const filename = fileOrBlob.name || 'webcam_capture.jpg';
  formData.append('image', fileOrBlob, filename);
  formData.append('confidence', confidence.toString());

  try {
    const response = await apiClient.post('/api/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Object detection request failed:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Network error or backend unavailable.'
    };
  }
};

export default {
  checkHealth,
  getModelInfo,
  detectObjects
};
