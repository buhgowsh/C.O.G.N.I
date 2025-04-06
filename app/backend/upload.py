from flask import Flask, request, jsonify
import os
import uuid
from analyze_video import analyze_video_file  # assume this wraps your OpenCV logic

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_video():
    video_file = request.files.get("video")
    if not video_file:
        return jsonify({"error": "No video uploaded"}), 400

    # Save video to disk
    filename = f"{uuid.uuid4()}.webm"
    path = os.path.join(UPLOAD_FOLDER, filename)
    video_file.save(path)

    # Run OpenCV analysis
    try:
        analysis = analyze_video_file(path)
        return jsonify(analysis)
    except Exception as e:
        print("Error during analysis:", e)
        return jsonify({"error": "Failed to process video"}), 500
