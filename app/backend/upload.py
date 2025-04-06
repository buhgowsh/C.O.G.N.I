from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS
import logging
import time
import cv2
import numpy as np
from pathlib import Path

# Import your video analysis function
from EyeTracker import analyze_video  # Make sure this file has the updated code

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('video_upload')

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(SCRIPT_DIR, "videos")

@app.route('/upload_video', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            logger.error("No video file in request")
            return jsonify({"error": "No video file provided"}), 400
        
        video_file = request.files['video']
        
        if video_file.filename == '':
            logger.error("Empty filename submitted")
            return jsonify({"error": "Empty filename"}), 400
        
        # Create videos directory if it doesn't exist
        os.makedirs(VIDEOS_DIR, exist_ok=True)
        
        # Save as session.mp4 in the videos directory
        save_path = os.path.join(VIDEOS_DIR, "session.mp4")
        
        logger.info(f"Saving video to: {save_path}")
        video_file.save(save_path)
        
        # Run analysis on the video
        logger.info("Starting video analysis...")
        result = analyze_video(save_path)
        plot_path = result["plot_path"]
        stats = result["stats"]
        
        return jsonify({
            "success": True,
            "message": "Video uploaded and analyzed successfully",
            "filepath": save_path,
            "plot_url": f"/plots/{os.path.basename(plot_path)}",
            "stats": stats
        })
    
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to serve plot images
@app.route('/plots/<filename>', methods=['GET'])
def serve_plot(filename):
    return send_from_directory(VIDEOS_DIR, filename)

# Route to get analysis results without uploading again
@app.route('/analyze_latest', methods=['GET'])
def analyze_latest():
    try:
        video_path = os.path.join(VIDEOS_DIR, "session.mp4")
        if not os.path.exists(video_path):
            return jsonify({"error": "No video found for analysis"}), 404
            
        result = analyze_video(video_path)
        plot_path = result["plot_path"]
        stats = result["stats"]
        
        return jsonify({
            "success": True,
            "message": "Video analyzed successfully",
            "plot_url": f"/plots/{os.path.basename(plot_path)}",
            "stats": stats
        })
    except Exception as e:
        logger.error(f"Error analyzing video: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create videos directory at startup
    os.makedirs(VIDEOS_DIR, exist_ok=True)
    
    logger.info(f"Server starting. Videos directory: {VIDEOS_DIR}")
    app.run(host='0.0.0.0', port=5000, debug=True)