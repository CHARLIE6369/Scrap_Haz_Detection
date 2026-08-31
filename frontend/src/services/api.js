import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout for CPU inference
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Health check timed out.');
    }
    if (!error.response) {
      throw new Error('Unable to connect to the YOLO backend. Make sure the Flask server is running.');
    }
    throw new Error(error.response?.data?.error || 'Health check failed.');
  }
};

export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/api/model-info');
    return response.data;
  } catch (error) {
    if (!error.response) {
      throw new Error('Unable to connect to the YOLO backend.');
    }
    throw new Error(error.response?.data?.error || 'Failed to retrieve model info.');
  }
};

export const detectObjects = async (payload, isFormData = true, confidence = 0.5) => {
  try {
    let response;
    if (isFormData) {
      // payload is FormData containing 'image' and optionally 'confidence'
      if (!payload.has('confidence')) {
        payload.append('confidence', confidence);
      }
      response = await apiClient.post('/api/detect', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // payload is JSON object { image: base64_str, confidence: confidence }
      response = await apiClient.post('/api/detect', {
        image: payload.image,
        confidence: confidence,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return response.data;
  } catch (error) {
    if (!error.response) {
      throw new Error('Unable to connect to the YOLO backend. Make sure the Flask server is running on ' + API_BASE_URL);
    }
    const backendErr = error.response.data?.error || error.response.data?.message;
    throw new Error(backendErr || 'An error occurred during object detection.');
  }
};

export default {
  checkHealth,
  getModelInfo,
  detectObjects,
};
