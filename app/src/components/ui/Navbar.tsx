import { Menu } from "lucide-react";
import { Link } from "react-router-dom"; // Fixed import

export default function Navbar() {
  return (
    <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-5xl px-8 py-3 flex items-center justify-between border border-blue-700 rounded-3xl shadow-2xl z-50 bg-white/90 backdrop-blur-sm">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide font-theme text-blue-800 pl-2">
        C.O.G.N.I
      </div>
      
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6 pr-2">
        <Link 
          to="/about" 
          className="text-lg font-extrabold hover:text-blue-600 transition-colors"
        >
          About
        </Link>
        <Link 
          to="/record" 
          className="text-lg font-extrabold hover:text-blue-600 transition-colors"
        >
          Lock in
        </Link>
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden pr-2">
        <Menu className="w-6 h-6" />
      </div>
    </header>
  );
}