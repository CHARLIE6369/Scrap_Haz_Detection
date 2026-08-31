import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('HEALTH ERROR:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.error ||
        `Health check failed (${error.response.status})`
      );
    }

    throw new Error(
      `Unable to connect to the YOLO backend at ${API_BASE_URL}`
    );
  }
};

export const getModelInfo = async () => {
  try {
    const response = await apiClient.get('/api/model-info');
    return response.data;
  } catch (error) {
    console.error('MODEL INFO ERROR:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.error ||
        `Model info failed (${error.response.status})`
      );
    }

    throw new Error(
      `Unable to connect to the YOLO backend at ${API_BASE_URL}`
    );
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

      // IMPORTANT:
      // Do NOT manually set Content-Type here.
      // The browser automatically creates:
      // multipart/form-data; boundary=...
      response = await apiClient.post(
        '/api/detect',
        payload
      );

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

    console.log('DETECTION SUCCESS:', response.data);

    return response.data;

  } catch (error) {

    console.error('========== DETECTION ERROR ==========');
    console.error('API URL:', API_BASE_URL);
    console.error('HTTP status:', error.response?.status);
    console.error('Backend response:', error.response?.data);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('=====================================');

    if (error.response) {

      const backendError =
        error.response.data?.error ||
        error.response.data?.message ||
        `Backend error: HTTP ${error.response.status}`;

      throw new Error(backendError);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Detection timed out. The Render CPU server may need more time for YOLO inference.'
      );
    }

    throw new Error(
      `Unable to connect to the YOLO backend at ${API_BASE_URL}`
    );
  }
};

export default {
  checkHealth,
  getModelInfo,
  detectObjects,
};