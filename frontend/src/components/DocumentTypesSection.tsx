
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { documentTypes } from '@/config/pricing';
import { useBrand } from '@/contexts/BrandContext';
import { FileText, Scale, CreditCard, Star } from 'lucide-react';

interface DocumentTypesSectionProps {
  onOrderClick: () => void;
}

const iconMap = {
  FileText,
  Scale,
  CreditCard
};

const DocumentTypesSection: React.FC<DocumentTypesSectionProps> = ({ onOrderClick }) => {
  const { currentBrand } = useBrand();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            W jakich sprawach możemy pomóc?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specjalizujemy się w analizie różnych typów dokumentów prawnych
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {documentTypes.map((docType, index) => {
            const IconComponent = iconMap[docType.icon as keyof typeof iconMap] || FileText;
            const adjustedPrice = Math.round(docType.basePrice * currentBrand.priceMultiplier);
            const isPopular = index === 0; // Pierwszy typ jako popularny
            
            return (
              <Card 
                key={docType.id} 
                className={`relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isPopular ? 'ring-2' : ''
                }`}
                style={isPopular ? { borderColor: currentBrand.primaryColor } : {}}
              >
                {isPopular && (
                  <Badge 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white"
                    style={{ backgroundColor: currentBrand.primaryColor }}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Popularne
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${currentBrand.primaryColor}20` }}
                    >
                      <IconComponent 
                        className="h-8 w-8"
                        style={{ color: currentBrand.primaryColor }}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {docType.name}
                  </CardTitle>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: currentBrand.primaryColor }}
                  >
                    od {adjustedPrice} zł
                  </div>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 text-sm">
                    {docType.description}
                  </p>
                  <Button 
                    className="w-full text-white"
                    style={{ backgroundColor: currentBrand.primaryColor }}
                    onClick={onOrderClick}
                  >
                    Zamów analizę
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Nie widzisz swojego typu dokumentu? Nie ma problemu!
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onOrderClick}
            style={{ borderColor: currentBrand.primaryColor, color: currentBrand.primaryColor }}
          >
            Wgraj dowolny dokument
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocumentTypesSection;
