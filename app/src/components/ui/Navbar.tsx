import { Menu } from "lucide-react"
import { Link } from "react-router";


export default function Navbar(){
    return (
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
        <div className="text-3xl font-bold tracking-wide font-theme text-blue-800 font-theme">C.O.G.N.I</div>
        <nav className="hidden md:flex space-x-4">
        <Link to="/about">
              <p className="text-lg font-extrbold">About</p>
        </Link>
        <Link to="/record">
            <p className="text-lg font-extrbold">Lock in</p>
        </Link>
        </nav>
        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>
      </header>
    );
}