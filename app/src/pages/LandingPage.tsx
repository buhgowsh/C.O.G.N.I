import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/Navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center px-4 md:px-8">
        <div className="flex flex-col text-center w-full gap-2 fade-in">
          
          {/* Large Title */}
          <h1 className="text-[10rem] font-bold tracking-tight text-blue-800 font-theme tracking-widest">
            C.O.G.N.I  
          </h1>
          
          <div className="w-full h-auto mb-6">
            {/* Description of what it does */}
            <p className="text-2xl md:text-2xl font-semibold text-blue-500 mb-6">
              Cognitive Optimization for Neurodivergent Individuals. 
            </p>
            
            {/* Gray slogan or tagline */}
            <p className="text-md md:text-lg text-gray-500">
              Empower your focus, track your attention, and learn how to lock in.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-center gap-6">
            <Link to="/about" className="w-full sm:w-auto">
              <Button 
                text="Learn More" 
                className="w-full sm:w-full py-3 px-6 text-lg font-semibold hover:bg-blue-800 hover:text-white transition duration-300" 
              />
            </Link>
            <Link to="/record" className="w-full sm:w-auto">
              <Button 
                text="Try it out!" 
                className="w-full sm:w-full py-3 px-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300" 
              />
            </Link>
          </div>
        </div>
      </main>
    </div>
    );
}