
import { Button } from "@/components/ui/button";
import { Gavel, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LegalAI</h1>
              <p className="text-xs text-gray-600">Kancelaria Online</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Strona główna
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Zalety
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              O nas
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kontakt
            </a>
            <Button variant="outline" size="sm">
              Zaloguj się
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Strona główna
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Zalety
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                O nas
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Kontakt
              </a>
              <Button variant="outline" size="sm" className="w-fit">
                Zaloguj się
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
