
import React, { useState } from 'react';
import { BrandProvider } from '@/contexts/BrandContext';
import BrandHeader from '@/components/BrandHeader';
import HeroSection from '@/components/HeroSection';
import DocumentTypesSection from '@/components/DocumentTypesSection';
import OrderForm from '@/components/OrderForm';
import Footer from '@/components/Footer';

const NewIndex = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);

  if (showOrderForm) {
    return (
      <BrandProvider>
        <OrderForm onBack={() => setShowOrderForm(false)} />
      </BrandProvider>
    );
  }

  return (
    <BrandProvider>
      <div className="min-h-screen bg-gray-50">
        <BrandHeader />
        <HeroSection onOrderClick={() => setShowOrderForm(true)} />
        <DocumentTypesSection onOrderClick={() => setShowOrderForm(true)} />
        <Footer />
      </div>
    </BrandProvider>
  );
};

export default NewIndex;
