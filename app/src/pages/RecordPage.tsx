import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null); // <-- FIXED

  useEffect(() => {
    async function getCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Now TypeScript is happy
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    getCamera();
  }, []);

  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full relative">
      <div className="absolute inset-0 -z-10 blur-xs">
        <ParticleComponent />
      </div>

      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center gap-12 px-4 md:px-8 py-16 z-10">
        {/* Session Indicator */}
        <div className="flex items-center gap-3">
          <div className={`h-4 w-4 rounded-full transition-all duration-300 shadow-md ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-green-400"
          }`} />
          <span className="text-lg font-medium tracking-wide text-gray-700">
            {isRecording ? "Recording" : "Not recording"}
          </span>
        </div>

        {/* Video Box */}
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-blue-300 bg-white max-w-[720px] w-full aspect-video">
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
          onClick={() => setIsRecording(prev => !prev)}
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
