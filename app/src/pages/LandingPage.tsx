import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full">
      {/* Particles Background with Blur */}
      <Navbar />
      <div className="absolute inset-0 z-0 blur-xs">
        <ParticleComponent />
      </div>
      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center px-4 md:px-8 z-20">
        <div className="flex flex-col text-center w-full gap-2 fade-in">
          {/* Large Title with hover animation */}
          <h1 className="text-[10rem] font-bold tracking-tight text-blue-800 font-theme tracking-wide mb-2 text-shadow-sm 
              transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.01]">
            C.O.G.N.I <p className="ml-6 inline">AI</p> 
          </h1>
          
          <div className="w-full h-auto relative bottom-10">
            {/* Description with hover animation */}
            <p className="text-2xl md:text-2xl font-semibold text-blue-500 mb-6 text-shadow-xs
                transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              Cognitive Optimization for Neurodivergent Individuals. 
            </p>
            
            {/* Slogan with hover animation */}
            <p className="text-md md:text-lg text-gray-500 font-semibold text-shadow-xs
                transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              Empower your focus, track your attention, and learn how to lock in.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-center gap-6">
            <Link to="/about" className="w-full sm:w-auto">
              <Button 
                text="Learn More" 
                className="w-full sm:w-full py-3 px-6 text-lg font-semibold bg-blue-500 hover:bg-blue-700 hover:text-white transition duration-300 shadow-lg" 
              />
            </Link>
            <Link to="/record" className="w-full sm:w-auto">
              <Button 
                text="Try it out! →" 
                className="w-full sm:w-full py-3 px-6 text-lg font-semibold bg-blue-500 text-white hover:bg-blue-700 transition duration-300 shadow-lg" 
              />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}