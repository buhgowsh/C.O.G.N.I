import Button from "@/components/ui/Button";
import Navbar from "@/components/ui/Navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full ">
      {/* Navbar */}    
      <Navbar/>
      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center px-4">
        <div className="flex flex-col text-center space-y-6 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-800">
            C.O.G.N.I
          </h1>
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-blue-600">Cognitive Optimization for Neurodivergent Individuals
                </span>
                <p>Stay focused, track your attention, and learn how to lock in.</p>
          </p>
          <div className="flex justify-center gap-6 pt-2">
            <Button text="Learn More"/>
            <Button text="Try it out!"/>
          </div>
        </div>
      </main>
    </div>
  )
}