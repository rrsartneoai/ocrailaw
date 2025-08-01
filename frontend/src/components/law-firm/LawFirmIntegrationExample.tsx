import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LawFirmSearch } from './LawFirmSearch';
import { LawFirmDetail } from './LawFirmDetail';
import { LawFirm } from '@/types/law-firm';

interface LawFirmIntegrationExampleProps {
  onLawFirmSelect?: (lawFirm: LawFirm) => void;
}

export function LawFirmIntegrationExample({ onLawFirmSelect }: LawFirmIntegrationExampleProps) {
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [view, setView] = useState<'search' | 'detail'>('search');

  const handleLawFirmSelect = (lawFirm: LawFirm) => {
    setSelectedLawFirm(lawFirm);
    setView('detail');
    onLawFirmSelect?.(lawFirm);
  };

  const handleBack = () => {
    setView('search');
    setSelectedLawFirm(null);
  };

  const handleContact = (lawFirm: LawFirm) => {
    // Here you can integrate with your existing contact/order system
    console.log('Contact law firm:', lawFirm);
    // Example: navigate to order form with pre-selected law firm
    // or open contact modal
  };

  if (view === 'detail' && selectedLawFirm) {
    return (
      <LawFirmDetail
        lawFirmId={selectedLawFirm.id}
        onBack={handleBack}
        onContact={handleContact}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Znajdź kancelarię prawną</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Wyszukaj i wybierz kancelarię prawną spośród tysiąca zweryfikowanych firm.
          </p>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">Zweryfikowane kancelarie</Badge>
            <Badge variant="outline">Aktualne dane kontaktowe</Badge>
            <Badge variant="outline">Specjalizacje prawne</Badge>
          </div>
        </CardContent>
      </Card>

      <LawFirmSearch 
        onLawFirmSelect={handleLawFirmSelect}
        className="w-full"
      />
    </div>
  );
}