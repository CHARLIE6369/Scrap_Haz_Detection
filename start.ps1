Write-Host "Launching YOLO Object Detection Application..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; python app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"
Write-Host "Both Backend (http://127.0.0.1:5000) and Frontend (http://localhost:5173) launched!" -ForegroundColor Green
