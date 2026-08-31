@echo off
echo Starting YOLO Object Detection App...
start "YOLO Backend API" cmd /k "cd /d %~dp0backend && python app.py"
start "YOLO React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both Backend (http://127.0.0.1:5000) and Frontend (http://localhost:5173) launched!
