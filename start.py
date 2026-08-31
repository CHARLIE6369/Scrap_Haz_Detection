import subprocess
import sys
import os
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("==================================================")
    print("🚀 Starting YOLO Object Detection Application...")
    print("==================================================")

    print("\n1. Launching Flask Backend Server (http://127.0.0.1:5000)...")
    backend_proc = subprocess.Popen([sys.executable, "app.py"], cwd=backend_dir)

    time.sleep(2)

    print("\n2. Launching Vite React Frontend (http://localhost:5173)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=frontend_dir)

    print("\n--------------------------------------------------")
    print("✅ Application is now running!")
    print("👉 Frontend: http://localhost:5173")
    print("👉 Backend API: http://127.0.0.1:5000")
    print("--------------------------------------------------")
    print("Press Ctrl+C to stop both services.\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
