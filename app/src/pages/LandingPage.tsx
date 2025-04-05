import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full ">
      {/* Navbar */}
      <header className="w-full px-6 py-4 shadow-sm flex items-center justify-between border-b border-gray-200">
        <div className="text-2xl font-bold tracking-wide">C.O.G.N.I</div>
        <nav className="hidden md:flex space-x-4">
          <Button variant="blue">About</Button>
          <Button variant="blue">Record</Button>
        </nav>
        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>
      </header>

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
            <Button size="lg" variant="blue">Learn More</Button>
            <Button size="lg" variant="blue">Try It</Button>
          </div>
        </div>
      </main>
    </div>
  )
}