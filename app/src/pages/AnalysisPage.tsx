import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  
  // OpenAI chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [initialPromptSent, setInitialPromptSent] = useState(false);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  // Send initial prompt to OpenAI when analysis data is loaded
  useEffect(() => {
    if (analysisData && !initialPromptSent) {
      const initialPrompt = createInitialPrompt(analysisData);
      handleSendAiMessage(initialPrompt, true);
      setInitialPromptSent(true);
    }
  }, [analysisData, initialPromptSent]);

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

  // Create initial prompt with analysis data
  const createInitialPrompt = (data) => {
    return `I've just completed an eye-tracking attention session with the following metrics:
    - Focus slope: ${data.stats.slope.toFixed(4)} (${data.stats.slope > 0 ? "improving" : "decreasing"} focus)
    - Average detection score: ${data.stats.average_y.toFixed(4)}
    - Session duration: ${(data.stats.x_range[1] - data.stats.x_range[0]).toFixed(1)} seconds
    
    Based on this data, can you provide me with:
    1. An analysis of my focus patterns
    2. Practical recommendations to improve my attention span
    3. Exercises I can do to enhance my focus`;
  };

  // Handle sending messages to OpenAI API
  const handleSendAiMessage = async (messageContent, isSystem = false) => {
    if (!messageContent.trim()) return;
    
    // Add user message to chat
    if (!isSystem) {
      setMessages(prev => [...prev, { role: "user", content: messageContent }]);
    }
    
    setAiLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: isSystem 
            ? [{ role: "user", content: messageContent }] 
            : [...messages, { role: "user", content: messageContent }]
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, 
        ...(isSystem ? [{ role: "user", content: messageContent }] : []),
        { role: "assistant", content: data.response }
      ]);
    } catch (err) {
      console.error("OpenAI API error:", err);
      setMessages(prev => [...prev, 
        ...(isSystem ? [{ role: "user", content: messageContent }] : []),
        { role: "assistant", content: "Sorry, I encountered an error processing your request." }
      ]);
    } finally {
      setAiLoading(false);
      setNewMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendAiMessage(newMessage);
  };

  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full pt-16 overflow-y-auto">
      <Navbar />
      <div className="absolute inset-0 z-0 blur-xs">
        <ParticleComponent />
      </div>
      
      <main className="flex-grow flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-12 z-20">
        {/* Left section - Current dashboard */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {loading && (
            <div className="text-4xl font-extrabold text-center text-blue-800 font-theme text-shadow-md">
              Loading results...
            </div>
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
            <div className="w-full max-w-xl flex flex-col gap-8">
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
                      Time range: <span className="font-mono">
                        {analysisData.stats.x_range[0].toFixed(1)} - {analysisData.stats.x_range[1].toFixed(1)} seconds
                      </span>
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
        </div>
        
        {/* Right section - OpenAI chat */}
        <div className="w-full lg:w-1/2 flex flex-col border border-gray-300 rounded-xl shadow-lg overflow-hidden h-[700px]">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-semibold">Focus AI Assistant</h2>
            <p className="text-sm opacity-80">Get personalized recommendations based on your focus data</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 && !aiLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {analysisData ? 
                  "Processing your focus data..." : 
                  "Load your analysis data to start a conversation"}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-300 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-300 rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-300">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about your focus or attention span..."
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={aiLoading || !analysisData}
              />
              <button
                type="submit"
                disabled={aiLoading || !newMessage.trim() || !analysisData}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}