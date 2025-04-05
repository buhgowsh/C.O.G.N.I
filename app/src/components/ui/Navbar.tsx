import Button from "@/components/ui/Button"
import { Menu } from "lucide-react"


export default function Navbar(){
    return (
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="text-2xl font-bold tracking-wide">C.O.G.N.I</div>
        <nav className="hidden md:flex space-x-4">
          <Button text="About"/>
          <Button text="Lock in"/>
        </nav>
        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>
      </header>
    );
}