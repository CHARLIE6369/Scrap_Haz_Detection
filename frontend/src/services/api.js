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

export const detectObjects = async (
  payload,
  isFormData = true,
  confidence = 0.5
) => {
  try {
    let response;

    if (isFormData) {
      if (!payload.has('confidence')) {
        payload.append('confidence', confidence);
      }

      response = await apiClient.post('/api/detect', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await apiClient.post(
        '/api/detect',
        {
          image: payload.image,
          confidence: confidence,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('DETECTION RESPONSE:', response.data);

    return response.data;

  } catch (error) {

    console.error('========== DETECTION ERROR ==========');
    console.error('API URL:', API_BASE_URL);
    console.error('Error:', error);
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Response:', error.response);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Request:', error.request);
    console.error('======================================');

    if (error.response) {
      const backendError =
        error.response.data?.error ||
        error.response.data?.message ||
        `Backend returned HTTP ${error.response.status}`;

      throw new Error(backendError);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Detection request timed out. CPU inference may take longer on Render.');
    }

    throw new Error(
      `Unable to connect to the YOLO backend at ${API_BASE_URL}`
    );
  }
};