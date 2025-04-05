import Navbar from "@/components/ui/Navbar";
import ParticleComponent from "@/components/ui/Particles";

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white text-blue-900 min-h-screen w-full relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-10 blur-xs">
        <ParticleComponent />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow min-h-screen w-full px-6 md:px-20 py-16 flex flex-col gap-12 items-center justify-center z-10 ">
        <section className="max-w-4xl text-center space-y-4 fade-in">
          <h1 className="text-[5rem] font-bold text-blue-800 font-theme mb-4 text-shadow-sm ">About C.O.G.N.I</h1>
          <p className="text-xl text-gray-700 text-shadow-sm ">
            <strong>C.O.G.N.I</strong> stands for <em>"Cognitive Optimization for Neurodivergent Individuals"</em>.
            This application aims to empower users by offering insights into attention patterns and providing tools 
            to help build more consistent focus habits.
          </p>
        </section>

        <section className="max-w-4xl space-y-4 text-left fade-in">
          <h2 className="text-[4rem] font-semibold font-theme text-center text-blue-700 text-shadow-sm ">Inspiration</h2>
          <p className="text-xl text-gray-700 text-shadow-sm ">
            Many neurodivergent individuals face challenges with attention, overstimulation, and inconsistency in mental energy.
            We wanted to create a calm, supportive space that could visualize attention trends and offer focus-enhancing features 
            in a respectful and inclusive way. Our goal is not to "fix" — it’s to analyze and understand.
          </p>
        </section>
      </main>
    </div>
  );
}
