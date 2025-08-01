
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Brand, getCurrentBrand } from '@/config/brands';

interface BrandContextType {
  currentBrand: Brand;
  updateBrand: (brandId: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState<Brand>(getCurrentBrand());

  useEffect(() => {
    // Aktualizuj CSS variables dla bieżącego branda
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', currentBrand.primaryColor);
    root.style.setProperty('--brand-secondary', currentBrand.secondaryColor);
    
    // Aktualizuj tytuł strony
    document.title = `${currentBrand.name} - ${currentBrand.tagline}`;
  }, [currentBrand]);

  const updateBrand = (brandId: string) => {
    // W rzeczywistej aplikacji tutaj byłaby logika zmiany domeny
    console.log(`Switching to brand: ${brandId}`);
  };

  return (
    <BrandContext.Provider value={{ currentBrand, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
