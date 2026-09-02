# Scrap & Hazardous Material Detection System

A full-stack, production-quality computer vision web application that detects and classifies scrap components (**cylinder**, **shock absorber**) in real time, powered by a **React + Vite + Tailwind CSS** frontend and a **Flask + Ultralytics YOLO11n** backend.

---

## 📌 Problem Statement

Manual sorting of scrap materials is slow and error-prone. This project automates detection and classification of scrap components using computer vision, improving speed and consistency in industrial recycling and waste-management workflows.

---

## 🌟 Features

* **Image Upload Detection:** Upload local images (JPG, JPEG, PNG, WEBP) to detect objects with bounding boxes, confidence %, and parsed coordinate details.
* **Webcam Real-Time Detection:** Open your device's webcam to capture frames or enable interval live-stream detection.
* **Confidence Threshold Control:** Adjust confidence threshold from 0% to 100% dynamically via an interactive slider.
* **Statistical Insights:** View Total Objects Detected, Highest Confidence %, Unique Classes Detected, and Inference Time (ms).
* **Detailed Coordinates Table:** Parsed bounding box coordinates `(X1, Y1, X2, Y2)` rendered in a responsive data table.
* **Dynamic Class Resolution:** Class names are extracted dynamically from the loaded YOLO PyTorch model (`.pt`).
* **Decoupled Architecture:** Clean separation between frontend (Netlify SPA ready) and backend Python inference API.

---

## 🎯 Classes Detected

* Cylinder
* Shock Absorber

## 🧠 Model

Trained a custom **YOLO11n (nano)** model using Ultralytics on a Roboflow-labeled dataset (2 classes, 50 epochs), resolving class imbalance and merging mislabeled duplicate classes during preprocessing.

**Validation results:**

| Metric | Value |
|---|---|
| mAP50 | 0.65 |
| mAP50-95 | 0.43 |
| Precision | 0.74 |
| Recall | 0.56 |
| Inference time | ~12.4 ms/image |

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
* **Computer Vision:** Ultralytics YOLOv9 (PyTorch) & OpenCV (cv2)
* **Image Processing:** Pillow & NumPy
* **Environment:** Python-Dotenv

---

## 📁 Project Structure

```
Scrap_Haz_Detection/
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
├── dataset_check.py     # counts label distribution across classes
├── validate.py          # runs validation metrics (mAP, precision, recall)
├── inferance.py         # runs detection on a static image
├── webcam.py            # runs real-time detection via webcam
├── data.yaml            # dataset configuration for YOLO training
├── .gitignore
├── netlify.toml
└── README.md
```

---

## ⚙️ Requirements

* **Python:** 3.10 or higher
* **Node.js:** 18 or higher (npm 9+)
* **Browser:** Chrome, Firefox, Edge, or Safari with webcam permissions enabled

---

## 🚀 Running Locally

### 1. Adding Your YOLO Model
Place your trained PyTorch YOLO model file (`best.pt`) inside the backend models folder:

```bash
backend/models/best.pt
```
*(The repository pre-loads this model automatically on Flask server start.)*

### 2. Backend Setup & Run

```bash
cd backend

# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
The backend server will run on 👉 `http://127.0.0.1:5000`

### 3. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```
The web application will run on 👉 `http://localhost:5173`

### Quick Script Usage

```bash
pip install -r requirements.txt
python inferance.py     # static image inference
python webcam.py        # real-time webcam inference
python validate.py      # run validation metrics
```

---

## 📡 API Endpoints

### 1. Health Check
* **Endpoint:** `GET /api/health`
```json
{
  "success": true,
  "status": "ok",
  "model_loaded": true
}
```

### 2. Model Information
* **Endpoint:** `GET /api/model-info`
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

## 🌐 Deployment

The frontend is configured for **Netlify** SPA deployment; the backend should be hosted on a Python-friendly platform (Render, AWS EC2, etc.) since persistent PyTorch YOLO backends can't run in serverless frontend environments.

1. Connect your repository to Netlify.
2. Build settings: **Build Command:** `npm run build`, **Publish Directory:** `dist`
3. Add environment variable in Netlify Dashboard: `VITE_API_URL` = your production backend URL (e.g. `https://your-yolo-backend.onrender.com`)
4. Deploy the backend separately (e.g. Render) and point `VITE_API_URL` to it.

**Live Demo:** _add your deployed public URL here once hosted (avoid `localhost` links — they only work on your own machine)_

---

## ❓ Troubleshooting

* **Webcam Permission Denied:** Ensure browser permissions allow camera access for your frontend URL.
* **Backend Connection Error:** Verify the Flask server is active and check CORS settings.
* **Model Not Found Error:** Confirm `best.pt` exists in `backend/models/best.pt`.
* **Python Ultralytics Error:** Ensure `pip install ultralytics opencv-python Pillow` completed successfully.

---

## 📄 License

MIT
