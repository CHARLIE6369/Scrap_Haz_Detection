from ultralytics import YOLO

model = YOLO("runs/runs/detect/scrab_detection_project/scrab_yolo_training/weights/best.pt")

metrics = model.val(data="datasets/data.yaml")
print(metrics)