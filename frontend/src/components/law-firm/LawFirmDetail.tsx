import React from 'react';
import { MapPin, Phone, Mail, Globe, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLawFirmDetail } from '@/hooks/useLawFirm';
import { LawFirm } from '@/types/law-firm';

interface LawFirmDetailProps {
  lawFirmId: string;
  onContact?: (lawFirm: LawFirm) => void;
  onBack?: () => void;
}

export function LawFirmDetail({ lawFirmId, onContact, onBack }: LawFirmDetailProps) {
  const { data: lawFirm, isLoading, error } = useLawFirmDetail(lawFirmId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        Ładuję szczegóły kancelarii...
      </div>
    );
  }

  if (error || !lawFirm) {
    return (
      <div className="text-red-500 text-center py-4">
        Nie udało się załadować szczegółów kancelarii
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          ← Powrót do wyszukiwania
        </Button>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{lawFirm.name}</CardTitle>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                {lawFirm.address.street}, {lawFirm.address.city}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">NIP: {lawFirm.tax_number}</p>
              {lawFirm.krs_number && (
                <p className="text-sm text-gray-500">KRS: {lawFirm.krs_number}</p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Informacje kontaktowe</h3>
              <div className="space-y-2">
                {lawFirm.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{lawFirm.contact.phone}</span>
                  </div>
                )}
                {lawFirm.contact.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{lawFirm.contact.email}</span>
                  </div>
                )}
                {lawFirm.contact.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <a 
                      href={lawFirm.contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {lawFirm.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Specjalizacje</h3>
              <div className="flex flex-wrap gap-2">
                {lawFirm.specializations.map((spec) => (
                  <Badge key={spec.id} variant="secondary">
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {lawFirm.description && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-3">Opis</h3>
                <p className="text-gray-700 leading-relaxed">{lawFirm.description}</p>
              </div>
            </>
          )}

          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Utworzono: {new Date(lawFirm.created_at).toLocaleDateString('pl-PL')}
            </div>
            {onContact && (
              <Button onClick={() => onContact(lawFirm)}>
                Skontaktuj się
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}