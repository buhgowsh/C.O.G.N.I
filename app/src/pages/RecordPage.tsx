import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // time in seconds
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Webcam feed
  useEffect(() => {
    async function getCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            chunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setVideoBlob(blob); // Store the video blob
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    getCamera();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRecording) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start/Stop Recording
  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop(); // Stop recording and trigger 'onstop' to capture video
    } else {
      chunksRef.current = []; // Reset chunks when starting a new recording
      mediaRecorderRef.current?.start();
    }
    setIsRecording((prev) => !prev);
  };

  // Upload video to backend
  const uploadVideo = async () => {
    if (!videoBlob) {
      alert("No video to upload");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoBlob, "recording.webm");

    try {
      setUploading(true);
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Analysis Result:", data);
      // Handle the result (e.g., display analysis result)
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-10 blur-xs">
        {!isRecording ? <ParticleComponent /> : <></>}
      </div>
  
      <Navbar />
  
      <main className="flex-grow flex flex-col items-center justify-center gap-12 px-4 md:px-8 py-16 z-10">
        {/* Session Indicator + Timer */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className={`h-4 w-4 rounded-full transition-all duration-300 shadow-md ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-400"
              }`}
            />
            <span className="text-lg font-medium tracking-wide text-gray-700">
              {isRecording ? "Recording" : "Not recording"}
            </span>
          </div>
          {isRecording && (
            <span className="text-lg font-mono text-gray-600">
              ⏱ {formatTime(elapsedTime)}
            </span>
          )}
        </div>
  
        {/* Enlarged Video Box */}
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-blue-700 bg-white max-w-[800px] w-full h-[500px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Buttons - Start/Stop & Upload */}
        <div className="flex flex-row gap-6 mt-4">
          <button
            onClick={toggleRecording}
            className={`py-3 px-8 text-lg font-semibold rounded-xl shadow-md transition duration-300 ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
  
          {/* Upload Button */}
          {videoBlob && !isRecording && (
            <button
              onClick={uploadVideo}
              className="py-3 px-8 text-lg font-semibold rounded-xl shadow-md bg-green-500 text-white hover:bg-green-600"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Video →"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
