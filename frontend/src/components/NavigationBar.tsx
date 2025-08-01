
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X } from "lucide-react";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-slate-900/95 backdrop-blur-sm border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold text-white">LegalAPI</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Funkcje
            </a>
            <a href="#api" className="text-gray-300 hover:text-white transition-colors">
              API
            </a>
            <a href="#generator" className="text-gray-300 hover:text-white transition-colors">
              Generator
            </a>
            <a href="#docs" className="text-gray-300 hover:text-white transition-colors">
              Dokumentacja
            </a>
            <Button 
              variant="outline" 
              className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
            >
              Wypróbuj API
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 rounded-lg mt-2">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">
                Funkcje
              </a>
              <a href="#api" className="block px-3 py-2 text-gray-300 hover:text-white">
                API
              </a>
              <a href="#generator" className="block px-3 py-2 text-gray-300 hover:text-white">
                Generator
              </a>
              <a href="#docs" className="block px-3 py-2 text-gray-300 hover:text-white">
                Dokumentacja
              </a>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
              >
                Wypróbuj API
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
