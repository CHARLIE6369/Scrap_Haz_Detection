import cv2
from ultralytics import YOLO

# Dataset class mapping (from data.yaml):
#   0 -> cylinder
#   1 -> shock absorber

model = YOLO("runs/runs/detect/scrab_detection_project/scrab_yolo_training/weights/best.pt")

video = cv2.VideoCapture(0)

while True:
    success, frame = video.read()

    if success == True:
        results = model(frame)

        frame_has_cylinder = False
        frame_has_shock_absorber = False

        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                if class_id == 0:
                    frame_has_cylinder = True
                    color = (255, 0, 0)     # blue for cylinder
                else:
                    frame_has_shock_absorber = True
                    color = (0, 165, 255)   # orange for shock absorber

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 3)
                label = f"{class_name} {confidence:.2f}"
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        # Overall status banner
        if frame_has_cylinder and frame_has_shock_absorber:
            verdict, vcolor = "CYLINDER + SHOCK ABSORBER", (0, 255, 255)
        elif frame_has_cylinder:
            verdict, vcolor = "CYLINDER", (255, 0, 0)
        elif frame_has_shock_absorber:
            verdict, vcolor = "SHOCK ABSORBER", (0, 165, 255)
        else:
            verdict, vcolor = "NO OBJECT DETECTED", (200, 200, 200)

        cv2.putText(frame, f"Detected: {verdict}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, vcolor, 2)

        cv2.imshow("YOLO Detection", frame)

        key = cv2.waitKey(1)
        if key == 113 or key == 81:    # 'q' or 'Q'
            break
    else:
        print("Video Stopped")
        break

video.release()
cv2.destroyAllWindows()