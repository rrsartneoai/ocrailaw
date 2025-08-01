
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
import { ArrowRight, CheckCircle, FileText, Clock, Shield } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick }) => {
  const { currentBrand } = useBrand();

  return (
    <section 
      className="relative py-20 lg:py-32 text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${currentBrand.primaryColor} 0%, ${currentBrand.secondaryColor} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            {currentBrand.description}
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {currentBrand.tagline}
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Wgraj swoje pismo, otrzymaj profesjonalną analizę prawną i gotowe pisma procesowe w ciągu 24 godzin
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={onOrderClick}
            >
              Zamów analizę teraz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">od 49 zł</div>
              <div className="text-sm text-white/80">za analizę</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
              <span>Gwarancja jakości</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-green-300 mr-2" />
              <span>24h realizacja</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-300 mr-2" />
              <span>Bezpieczne płatności</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
