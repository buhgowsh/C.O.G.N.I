import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // time in seconds
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Webcam feed
  useEffect(() => {
    async function getCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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

  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-10 blur-xs">
        <ParticleComponent />
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

        {/* Start/Stop Button */}
        <button
          onClick={() => setIsRecording((prev) => !prev)}
          className={`py-3 px-8 text-lg font-semibold rounded-xl shadow-md transition duration-300 ${
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </main>
    </div>
  );
}
