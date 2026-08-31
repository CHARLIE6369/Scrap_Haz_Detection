from ultralytics import YOLO
import cv2
import json

# Dataset class mapping (from data.yaml):
#   0 -> cylinder
#   1 -> shock absorber

model = YOLO("runs/runs/detect/scrab_detection_project/scrab_yolo_training/weights/best.pt")

image = cv2.imread("datasets/train/images/Screenshot-2025-02-16-221133_png_png_jpg.rf.b3d26dc46f1ca79d9b82abcf85224e8d.jpg")
if image is None:
    raise FileNotFoundError("sample_image.jpg not found in project root.")

results = model(image)

# Collect every detection
all_detections = []

for result in results:
    boxes = result.boxes
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        confidence = float(box.conf[0])
        class_id = int(box.cls[0])
        class_name = model.names[class_id]

        # Blue for cylinder, Orange for shock absorber
        color = (255, 0, 0) if class_id == 0 else (0, 165, 255)

        cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)
        label = f"{class_name} {confidence:.2f}"
        cv2.putText(image, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        all_detections.append({
            "class_id":   class_id,
            "class_name": class_name,
            "confidence": confidence,
        })

# ---- Decide overall verdict (most confident detection) ----
if all_detections:
    best = max(all_detections, key=lambda d: d["confidence"])
    verdict, verdict_conf = best["class_name"], best["confidence"]
else:
    verdict, verdict_conf = "unknown", 0.0

# ---- Count detections per class ----
cylinder_count = sum(1 for d in all_detections if d["class_id"] == 0)
shock_absorber_count = sum(1 for d in all_detections if d["class_id"] == 1)

# ---- Save prediction as JSON ----
output = {
    "verdict": verdict,
    "confidence": round(verdict_conf, 4),
    "cylinder_count": cylinder_count,
    "shock_absorber_count": shock_absorber_count,
}
with open("prediction.json", "w") as f:
    json.dump(output, f, indent=4)

print("Verdict:", verdict, "| Confidence:", round(verdict_conf, 4))
print("Cylinder detections:", cylinder_count)
print("Shock absorber detections:", shock_absorber_count)

cv2.imshow("Detection Result", image)
cv2.waitKey(0)
cv2.destroyAllWindows()