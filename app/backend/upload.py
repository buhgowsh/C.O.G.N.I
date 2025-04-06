from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
from werkzeug.utils import secure_filename
import subprocess
import datetime

app = Flask(__name__)
# Enable CORS for your React app
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'webm'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max upload

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_mp4(input_path, output_path):
    """Convert video to MP4 using ffmpeg"""
    try:
        # Check if ffmpeg is installed
        subprocess.run(['ffmpeg', '-version'], check=True, capture_output=True)
        
        # Run conversion
        result = subprocess.run([
            'ffmpeg', 
            '-i', input_path,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '22',
            '-c:a', 'aac',
            '-b:a', '128k',
            output_path
        ], check=True, capture_output=True)
        
        return True, output_path
    except subprocess.CalledProcessError as e:
        return False, f"FFmpeg error: {e.stderr.decode() if e.stderr else str(e)}"
    except Exception as e:
        return False, f"Error: {str(e)}"

@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part in the request'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No video selected for uploading'}), 400
        
    if file and allowed_file(file.filename):
        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{uuid.uuid4().hex[:8]}.{file_extension}"
        
        # Save the original uploaded file
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(original_path)
        
        response_data = {
            'message': 'Video successfully uploaded',
            'data': {
                'original_filename': original_filename,
                'saved_filename': unique_filename,
                'path': original_path,
                'size': os.path.getsize(original_path),
                'format': file_extension
            }
        }
        
        # If the file is WebM and ffmpeg is available, convert to MP4
        if file_extension == 'webm':
            try:
                mp4_filename = unique_filename.replace('.webm', '.mp4')
                mp4_path = os.path.join(app.config['UPLOAD_FOLDER'], mp4_filename)
                
                success, result = convert_to_mp4(original_path, mp4_path)
                
                if success:
                    response_data['data']['converted'] = True
                    response_data['data']['mp4_filename'] = mp4_filename
                    response_data['data']['mp4_path'] = mp4_path
                    response_data['data']['mp4_size'] = os.path.getsize(mp4_path)
                else:
                    response_data['data']['converted'] = False
                    response_data['data']['conversion_error'] = result
            except Exception as e:
                response_data['data']['converted'] = False
                response_data['data']['conversion_error'] = str(e)
        
        return jsonify(response_data), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)