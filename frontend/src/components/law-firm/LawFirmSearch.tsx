import React, { useState } from 'react';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLawFirmSearch } from '@/hooks/useLawFirm';
import { LawFirm, SearchParams } from '@/types/law-firm';
import { SPECIALIZATION_CODES } from '@/lib/law-firm-api/config';

interface LawFirmSearchProps {
  onLawFirmSelect?: (lawFirm: LawFirm) => void;
  className?: string;
}

export function LawFirmSearch({ onLawFirmSelect, className }: LawFirmSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    per_page: 20
  });

  const { data, isLoading, error } = useLawFirmSearch(searchParams);

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, q: query, page: 1 }));
  };

  const handleCityFilter = (city: string) => {
    setSearchParams(prev => ({ ...prev, city: city || undefined, page: 1 }));
  };

  const handleSpecializationFilter = (specialization: string) => {
    const specializations = specialization ? [specialization] : undefined;
    setSearchParams(prev => ({ ...prev, specializations, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Wyszukaj kancelarie prawne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Wyszukaj po nazwie lub opisie..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Miasto..."
                className="pl-10"
                onChange={(e) => handleCityFilter(e.target.value)}
              />
            </div>
            
            <Select onValueChange={handleSpecializationFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Specjalizacja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Wszystkie specjalizacje</SelectItem>
                {Object.entries(SPECIALIZATION_CODES).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Wyszukuję kancelarie...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          Wystąpił błąd podczas wyszukiwania: {error.message}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.lawFirms.map((lawFirm) => (
            <Card key={lawFirm.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onLawFirmSelect?.(lawFirm)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{lawFirm.name}</h3>
                    <p className="text-gray-600 mb-2">
                      {lawFirm.address.street}, {lawFirm.address.city}
                    </p>
                    {lawFirm.contact.phone && (
                      <p className="text-sm text-gray-500">Tel: {lawFirm.contact.phone}</p>
                    )}
                    {lawFirm.contact.email && (
                      <p className="text-sm text-gray-500">Email: {lawFirm.contact.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">NIP: {lawFirm.tax_number}</p>
                    {lawFirm.krs_number && (
                      <p className="text-sm text-gray-500">KRS: {lawFirm.krs_number}</p>
                    )}
                  </div>
                </div>
                
                {lawFirm.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{lawFirm.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {lawFirm.specializations.map((spec) => (
                    <Badge key={spec.id} variant="secondary">
                      {spec.name}
                    </Badge>
                  ))}
                </div>
                
                {lawFirm.lawyers.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Prawnicy: {lawFirm.lawyers.map(l => `${l.first_name} ${l.last_name}`).join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {data.meta && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={!data.meta.has_prev}
                onClick={() => handlePageChange(searchParams.page! - 1)}
              >
                Poprzednia
              </Button>
              <span className="flex items-center px-4">
                Strona {data.meta.page} z {data.meta.pages}
              </span>
              <Button
                variant="outline"
                disabled={!data.meta.has_next}
                onClick={() => handlePageChange(searchParams.page! + 1)}
              >
                Następna
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}