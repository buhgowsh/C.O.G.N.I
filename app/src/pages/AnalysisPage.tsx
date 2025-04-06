import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/analyze_latest");
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error("Failed to fetch analysis data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center gap-6 px-4 md:px-8 py-12">
        
        {loading && (
          <div className="text-xl text-gray-600 font-theme">Loading analysis data...</div>
        )}
        
        {error && (
          <div className="text-xl text-red-600 p-4 bg-red-100 rounded-lg">
            Error: {error}
            <button 
              onClick={fetchAnalysisData}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        {analysisData && !loading && !error && (
          <div className="w-full max-w-4xl flex flex-col gap-8">
            <div className="border border-gray-300 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 font-theme">Focus Tracking Analysis</h2>
              
              {/* Plot image */}
              <div className="my-6 flex justify-center">
                <img 
                  src={`http://localhost:5000${analysisData.plot_url}`}
                  alt="Eye Tracking Analysis"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Trend Analysis</h3>
                  <p className="text-gray-700">
                    Slope: <span className="font-mono">{analysisData.stats.slope.toFixed(4)}</span>
                    {analysisData.stats.slope > 0 ? (
                      <span className="text-green-600"> (Improving focus)</span>
                    ) : (
                      <span className="text-red-600"> (Decreasing focus)</span>
                    )}
                  </p>
                  <p className="text-gray-700">
                    Average detection score: <span className="font-mono">{analysisData.stats.average_y.toFixed(4)}</span>
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Data Points</h3>
                  <p className="text-gray-700">
                    Total data points: <span className="font-mono">{analysisData.stats.data_count}</span>
                  </p>
                  <p className="text-gray-700">
                    Time range: <span className="font-mono">{analysisData.stats.x_range[0].toFixed(1)} - {analysisData.stats.x_range[1].toFixed(1)} seconds</span>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-800">
                <h3 className="font-semibold text-lg mb-2">Analysis Summary</h3>
                <p>
                  {analysisData.stats.average_y > 0.7 ? (
                    "Your focus level was excellent throughout the session!"
                  ) : analysisData.stats.average_y > 0.5 ? (
                    "Your focus level was good, with some room for improvement."
                  ) : (
                    "Your focus level could use improvement. Try to maintain eye contact with the screen."
                  )}
                </p>
                {analysisData.stats.slope > 0 ? (
                  <p className="mt-2">Your focus improved over the course of the session.</p>
                ) : (
                  <p className="mt-2">Your focus decreased over the course of the session.</p>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = "/record"}
              className="py-3 px-6 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 self-center"
            >
              Record New Session
            </button>
          </div>
        )}
      </main>
    </div>
  );
}