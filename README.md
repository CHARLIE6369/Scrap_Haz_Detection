# YOLO Object Detection Web Application

A full-stack, production-quality computer vision web application powered by a **React + Vite + Tailwind CSS** frontend and a **Flask + Ultralytics YOLO** backend.

---

## 🌟 Features

* **Image Upload Detection:** Upload local images (JPG, JPEG, PNG, WEBP) to detect objects with bounding boxes, confidence %, and parsed coordinate details.
* **Webcam Real-Time Detection:** Open your device's webcam to capture frames or enable interval live stream detection.
* **Confidence Threshold Control:** Adjust confidence threshold from 0% to 100% dynamically via an interactive slider.
* **Statistical Insights:** View Total Objects Detected, Highest Confidence %, Unique Classes Detected, and Inference Time (ms).
* **Detailed Coordinates Table:** Parsed bounding box coordinates `(X1, Y1, X2, Y2)` rendered in a responsive data table.
* **Dynamic Class Resolution:** Class names are extracted dynamically from the loaded YOLO PyTorch model (`.pt`).
* **Decoupled Architecture:** Clean separation between frontend (Netlify SPA ready) and backend Python inference API.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 + Vite
* **Styling:** Tailwind CSS (Glassmorphism design system)
* **Icons:** Lucide React
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios

### Backend
* **Language:** Python 3.10+
* **Web Framework:** Flask & Flask-CORS
* **Computer Vision:** Ultralytics YOLO (PyTorch) & OpenCV (cv2)
* **Image Processing:** Pillow & NumPy
* **Environment:** Python-Dotenv

---

## 📁 Project Structure

```
yolo-object-detection-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadCard.jsx
│   │   │   ├── WebcamCard.jsx
│   │   │   ├── DetectionResult.jsx
│   │   │   ├── DetectionStats.jsx
│   │   │   ├── DetectionTable.jsx
│   │   │   ├── ConfidenceSlider.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ImageDetection.jsx
│   │   │   ├── WebcamDetection.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useWebcam.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── netlify.toml
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── health.py
│   │   └── detection.py
│   ├── services/
│   │   ├── yolo_service.py
│   │   └── image_service.py
│   ├── utils/
│   │   ├── validators.py
│   │   └── response.py
│   └── models/
│       └── best.pt
│
├── .gitignore
├── netlify.toml
└── README.md
```

---

## ⚙️ Requirements

* **Python:** 3.10 or higher
* **Node.js:** 18 or higher (npm 9+)
* **Browser:** Chrome, Firefox, Edge, or Safari with WebCam permissions enabled

---

## 🚀 Running Locally

### 1. Adding Your YOLO Model
Place your trained PyTorch YOLO model file (`best.pt`) inside the backend models folder:

```bash
backend/models/best.pt
```

*(Note: The repository pre-loads this model automatically on Flask server start).*

---

### 2. Backend Setup & Run

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment (optional but recommended):

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask API server:

```bash
python app.py
```

The backend server will run on:
👉 `http://127.0.0.1:5000`

---

### 3. Frontend Setup & Run

Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The web application will run on:
👉 `http://localhost:5173`

---

## 📡 API Endpoints

### 1. Health Check
* **Endpoint:** `GET /api/health`
* **Response:**
```json
{
  "success": true,
  "status": "ok",
  "model_loaded": true
}
```

### 2. Model Information
* **Endpoint:** `GET /api/model-info`
* **Response:**
```json
{
  "success": true,
  "model_name": "best.pt",
  "model_loaded": true,
  "num_classes": 2,
  "class_names": {
    "0": "cylinder",
    "1": "shock_absorber"
  }
}
```

### 3. Object Detection
* **Endpoint:** `POST /api/detect`
* **Content-Type:** `multipart/form-data` or `application/json`
* **Payload:** `image` file or base64 data string, optional `confidence` (0.0 to 1.0)
* **Response:**
```json
{
  "success": true,
  "count": 2,
  "inference_time_ms": 82.5,
  "statistics": {
    "total_objects": 2,
    "highest_confidence": 95.2,
    "classes_detected": 2,
    "inference_time_ms": 82.5
  },
  "detections": [
    {
      "class_id": 0,
      "class_name": "cylinder",
      "confidence": 0.952,
      "confidence_percent": 95.2,
      "bbox": { "x1": 120, "y1": 80, "x2": 420, "y2": 510 }
    }
  ],
  "annotated_image": "data:image/jpeg;base64,...",
  "original_image": "data:image/jpeg;base64,..."
}
```

---

## 🌐 Netlify Deployment Guide

The frontend React application is completely configured for Netlify SPA deployment.

1. Connect your repository to Netlify.
2. Configure build settings:
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`
3. Add Environment Variable in Netlify Dashboard:
   * `VITE_API_URL` = Your production Python API backend URL (e.g. `https://your-yolo-backend.onrender.com`)
4. Trigger deploy! Netlify will build the SPA and handle client-side routing via `netlify.toml`.

*(Note: Persistent PyTorch YOLO backends cannot run directly inside serverless frontend environments; host the Flask API on a Python hosting provider like Render or AWS EC2).*

---

## ❓ Troubleshooting

* **Webcam Permission Denied:** Ensure browser permissions permit camera access for `localhost:5173`.
* **Backend Connection Error:** Verify the Flask server is active on `http://127.0.0.1:5000` and check CORS settings.
* **Model Not Found Error:** Confirm `best.pt` exists in `backend/models/best.pt`.
* **Python Ultralytics Error:** Ensure `pip install ultralytics opencv-python Pillow` completed successfully.
