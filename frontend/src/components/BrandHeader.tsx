
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBrand } from '@/contexts/BrandContext';
import { Phone, Mail, User } from 'lucide-react';

const BrandHeader = () => {
  const { currentBrand } = useBrand();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold"
              style={{ color: currentBrand.primaryColor }}
            >
              {currentBrand.logo}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#jak-to-dziala" className="text-gray-600 hover:text-gray-900 transition-colors">
              Jak to działa
            </a>
            <a href="#cennik" className="text-gray-600 hover:text-gray-900 transition-colors">
              Cennik
            </a>
            <a href="#o-nas" className="text-gray-600 hover:text-gray-900 transition-colors">
              O nas
            </a>
          </nav>

          {/* Contact & Login */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>kontakt@{currentBrand.domain}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Logowanie
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrandHeader;
