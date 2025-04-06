from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('video_upload')

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

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
        videos_dir = os.path.join(SCRIPT_DIR, "videos")
        os.makedirs(videos_dir, exist_ok=True)
        
        # Save as session.mp4 in the videos directory
        save_path = os.path.join(videos_dir, "session.mp4")
        
        logger.info(f"Saving video to: {save_path}")
        video_file.save(save_path)
        
        return jsonify({
            "success": True,
            "message": "Video uploaded successfully as session.mp4",
            "filepath": save_path
        })
    
    except Exception as e:
        logger.error(f"Error uploading video: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create videos directory at startup
    videos_dir = os.path.join(SCRIPT_DIR, "videos")
    os.makedirs(videos_dir, exist_ok=True)
    
    logger.info(f"Server starting. Videos directory: {videos_dir}")
    app.run(host='0.0.0.0', port=5000, debug=True)