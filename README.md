# Scrap_Haz_Detection

Machine Learning project to detect and classify scrap components (cylinder, shock absorber) using YOLOv9 object detection, built with Python and Ultralytics.

## Problem Statement
Manual sorting of scrap materials is slow and error-prone. This project automates detection and classification of scrap components using computer vision, improving speed and consistency in industrial recycling workflows.

## Tech Stack
- Python
- Ultralytics YOLOv9
- OpenCV
- PyTorch

## Classes Detected
- Cylinder
- Shock Absorber

## Project Structure
- `dataset_check.py` — counts label distribution across classes
- `validate.py` — runs validation metrics (mAP, precision, recall) on trained model
- `inferance.py` — runs detection on a static image
- `webcam.py` — runs real-time detection via webcam
- `data.yaml` — dataset configuration for YOLO training

## How to Run
```bash
pip install -r requirements.txt
python inferance.py
```

## Model
Trained using YOLOv9t (nano) on a custom Roboflow dataset with 2 classes, over 50 epochs.

## Live Demo
(http://localhost:5173)

