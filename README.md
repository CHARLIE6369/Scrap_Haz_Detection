# Scrap & Hazardous Material Detection System

A full-stack computer vision web application that detects and classifies scrap components (cylinder, shock absorber) from uploaded images or a live webcam feed. It uses a React + Vite + Tailwind CSS frontend and a Flask + Ultralytics YOLO11n backend.

## 📌 Problem Statement

Manual sorting of scrap materials is slow and error-prone. This project automates detection and classification of scrap components using computer vision, aiming to improve speed and consistency in recycling and waste-management workflows.

## 🌟 Features

- **Image Upload Detection:** Upload local images (JPG, JPEG, PNG, WEBP) to get bounding boxes, confidence %, and parsed coordinates.
- **Webcam Detection:** Capture frames from your webcam or enable interval-based live detection.
- **Confidence Threshold Control:** Adjust the confidence threshold from 0% to 100% with an interactive slider.
- **Statistical Insights:** Total objects detected, highest confidence %, unique classes detected, and inference time (ms).
- **Coordinates Table:** Bounding box coordinates (X1, Y1, X2, Y2) in a responsive table.
- **Dynamic Class Resolution:** Class names are read from the loaded YOLO model (`.pt`) rather than hard-coded.
- **Decoupled Architecture:** Frontend (Netlify SPA ready) and backend (Python inference API) are separate.

## 🎯 Classes Detected

- Cylinder
- Shock Absorber

## 🧠 Model

A custom YOLO11n (nano) model trained with Ultralytics on a Roboflow-labeled dataset (2 classes, 50 epochs). During preprocessing, mislabeled duplicate classes were merged and class imbalance was addressed.

**Validation results:**

| Metric | Value |
|---|---|
| mAP50 | 0.65 |
| mAP50-95 | 0.43 |
| Precision | 0.74 |
| Recall | 0.56 |
| Model inference time | ~12.4 ms/image |

> The ~12.4 ms figure is model-only inference measured during validation (GPU). On a CPU-only laptop, expect roughly 400-600 ms per image through the web app, plus a little overhead for image decoding, annotation and base64 encoding.

## ⚠️ Limitations

- Only two classes are supported; other scrap types are not detected.
- Recall is 0.56, so some objects will be missed, especially in cluttered scenes or poor lighting.
- Trained on a relatively small dataset, so performance on very different backgrounds or camera angles may drop.

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (glassmorphism design)
- Lucide React (icons)
- React Router DOM v6
- Axios

**Backend**
- Python 3.10+
- Flask & Flask-CORS
- Ultralytics YOLO11 (PyTorch) & OpenCV
- Pillow & NumPy
- Python-Dotenv

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
├── run_app.py           # starts backend + frontend with one command
├── start.bat            # Windows shortcut for run_app.py
├── convert_labels.py    # label conversion / cleanup during preprocessing
├── check_labels.py      # sanity-checks label files
├── dataset_check.py     # counts label distribution across classes
├── validate.py          # runs validation metrics (mAP, precision, recall)
├── inferance.py         # runs detection on a static image
├── webcam.py            # runs real-time detection via webcam
├── data.yaml            # dataset configuration for YOLO training
├── .gitignore
├── netlify.toml
└── README.md
```

## ⚙️ Requirements

- **Python:** 3.10 or higher
- **Node.js:** 18 or higher (npm 9+)
- **Browser:** Chrome, Firefox, Edge, or Safari with webcam permission enabled

## 🚀 Running Locally

### 1. Add the trained model

Place your trained weights at:

```
backend/models/best.pt
```

After training, Ultralytics saves the weights at `runs/detect/<run-name>/weights/best.pt`. Copy that file here. The backend loads it automatically on startup.

### 2. Install dependencies (one time)

Run these from the project root, meaning the folder that contains `backend/`, `frontend/` and `run_app.py`.

```powershell
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r backend/requirements.txt

cd frontend
npm install
cd ..
```

```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate

pip install -r backend/requirements.txt

cd frontend && npm install && cd ..
```

### 3. Start the app

**Option A: single command (recommended)**

```bash
python run_app.py
```

This starts both servers:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Open **http://localhost:5173** in your browser. Press `Ctrl+C` to stop both.

> The launcher prints an "APP RUNNING" banner even if a server crashed, so check the `[BACKEND]` / `[FRONTEND]` log lines. A healthy backend shows `Running on http://127.0.0.1:5000`.

**Option B: run each server manually**

```bash
# Terminal 1 - backend
cd backend
python app.py

# Terminal 2 - frontend
cd frontend
npm run dev
```

### Running again later

Dependencies are already installed, so you only need to activate the virtual environment and start the app:

```powershell
# Windows - activate the venv (adjust the path if your venv is in a parent folder)
.\venv\Scripts\Activate.ps1
# then, from the folder that contains run_app.py
python run_app.py
```

```bash
# Linux / macOS
source venv/bin/activate
python3 run_app.py
```

> **Common mistake:** if you see `Cannot find path '...\backend'` or `No such file or directory: 'backend/requirements.txt'`, you are in the wrong folder. `cd` into the folder that contains `backend/`, `frontend/` and `run_app.py` and try again.

### Quick script usage

```bash
pip install ultralytics opencv-python pillow
python inferance.py     # static image inference
python webcam.py        # real-time webcam inference
python validate.py      # run validation metrics
```

## 📡 API Endpoints

### 1. Health Check

`GET /api/health`

```json
{
  "success": true,
  "status": "ok",
  "model_loaded": true
}
```

### 2. Model Information

`GET /api/model-info`

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

`POST /api/detect`

- **Content-Type:** `multipart/form-data` or `application/json`
- **Payload:** image file or base64 data string, plus optional `confidence` (0.0 to 1.0)

Example response (values are illustrative):

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

## 🌐 Deployment

The frontend is configured for Netlify (SPA). The backend must be hosted on a Python-friendly platform (Render, AWS EC2, etc.), since a PyTorch inference server can't run on Netlify's serverless frontend hosting.

1. Connect your repository to Netlify.
2. Build settings: **Build command:** `npm run build`, **Publish directory:** `dist`
3. In the Netlify dashboard, add the environment variable `VITE_API_URL` set to your production backend URL (e.g. `https://your-yolo-backend.onrender.com`).
4. Deploy the backend separately and point `VITE_API_URL` to it.

<!-- Live Demo: add your deployed public URL here once hosted. Avoid localhost links. -->

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'flask'` | Activate the venv, then run `pip install -r backend/requirements.txt` |
| Webcam permission denied | Allow camera access for the frontend URL in your browser settings |
| Backend connection error | Make sure the Flask server is running on port 5000 and check CORS settings |
| Model not found | Confirm `best.pt` exists at `backend/models/best.pt` |
| Ultralytics errors | Run `pip install ultralytics opencv-python pillow` and confirm it completes without errors |
| `npm` not recognized | Install Node.js 18+ and reopen the terminal |

## 📄 License

MIT
