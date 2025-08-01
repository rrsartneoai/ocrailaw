!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class LawFirmIntegrationGenerator {
  constructor() {
    this.outputDir = 'src/lib/law-firm-api';
    this.typesDir = 'src/types';
    this.componentDir = 'src/components/law-firm';
    this.hooksDir = 'src/hooks';
  }

  async generate() {
    console.log('🚀 Generating Law Firm API integration...');
    
    // Create directories
    this.createDirectories();
    
    // Generate TypeScript types
    this.generateTypes();
    
    // Generate API client
    this.generateApiClient();
    
    // Generate React hooks
    this.generateHooks();
    
    // Generate React components
    this.generateComponents();
    
    // Generate configuration
    this.generateConfig();
    
    console.log('✅ Law Firm API integration generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Install dependencies: npm install axios react-query');
    console.log('2. Configure API_BASE_URL in src/lib/law-firm-api/config.ts');
    console.log('3. Import and use components in your app');
  }

  createDirectories() {
    const dirs = [this.outputDir, this.typesDir, this.componentDir, this.hooksDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  generateTypes() {
    console.log('📝 Generating TypeScript types...');
    
    const typesContent = `// Auto-generated types from Law Firm API specification
export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Specialization {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Lawyer {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  phone?: string;
  bar_number?: string;
}

export interface LawFirm {
  id: string;
  name: string;
  tax_number: string;
  krs_number?: string;
  founded_date?: string;
  description?: string;
  address: Address;
  contact: Contact;
  business_hours?: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  lawyers: Lawyer[];
  specializations: Specialization[];
}

export interface LawFirmCreateRequest {
  name: string;
  tax_number: string;
  krs_number?: string;
  description?: string;
  address: Address;
  contact: Contact;
  specialization_ids: string[];
}

export interface LawFirmUpdateRequest {
  name?: string;
  description?: string;
  address?: Address;
  contact?: Contact;
  specialization_ids?: string[];
}

export interface SearchParams {
  q?: string;
  city?: string;
  specializations?: string[];
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface JSONAPIResponse<T = any> {
  data: T;
  included?: any[];
  meta?: PaginationMeta;
  links?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status_code?: number;
  response_data?: any;
}
`;

    fs.writeFileSync(path.join(this.typesDir, 'law-firm.ts'), typesContent);
  }

  generateApiClient() {
    console.log('🔌 Generating API client...');
    
    const clientContent = `import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  LawFirm, 
  LawFirmCreateRequest, 
  LawFirmUpdateRequest, 
  SearchParams, 
  JSONAPIResponse, 
  ApiError 
} from '@/types/law-firm';
import { API_CONFIG } from './config';

export class LawFirmApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseData?: any
  ) {
    super(message);
    this.name = 'LawFirmApiError';
  }
}

export class LawFirmApiClient {
  private client: AxiosInstance;
  private retryAttempts: number = 3;

  constructor(baseURL: string = API_CONFIG.BASE_URL, apiKey?: string) {
    this.client = axios.create({
      baseURL: \`\${baseURL}/api/v1\`,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'LawFirmClient/1.0.0',
        ...(apiKey && { Authorization: \`Bearer \${apiKey}\` })
      },
      timeout: API_CONFIG.TIMEOUT
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest) {
          // Handle token refresh logic here if needed
          throw new LawFirmApiError('Unauthorized', 401, error.response?.data);
        }
        
        if (error.response?.status && error.response.status >= 500) {
          // Retry for server errors
          if (originalRequest && !originalRequest.metadata?.retryCount) {
            originalRequest.metadata = { retryCount: 1 };
            return this.client.request(originalRequest);
          }
        }
        
        const errorMessage = error.response?.data?.detail || error.message;
        throw new LawFirmApiError(
          errorMessage,
          error.response?.status,
          error.response?.data
        );
      }
    );
  }

  async createLawFirm(data: LawFirmCreateRequest): Promise<LawFirm> {
    const response = await this.client.post<JSONAPIResponse<any>>('/law-firms', data);
    return response.data.data.attributes;
  }

  async getLawFirm(id: string): Promise<LawFirm> {
    const response = await this.client.get<JSONAPIResponse<any>>(\`/law-firms/\${id}\`);
    return response.data.data.attributes;
  }

  async searchLawFirms(params: SearchParams = {}): Promise<{
    lawFirms: LawFirm[];
    meta: any;
    links: any;
  }> {
    const response = await this.client.get<JSONAPIResponse<any[]>>('/law-firms', {
      params
    });
    
    return {
      lawFirms: response.data.data.map((item: any) => item.attributes),
      meta: response.data.meta,
      links: response.data.links
    };
  }

  async updateLawFirm(id: string, data: LawFirmUpdateRequest): Promise<LawFirm> {
    const response = await this.client.put<JSONAPIResponse<any>>(\`/law-firms/\${id}\`, data);
    return response.data.data.attributes;
  }

  async deleteLawFirm(id: string): Promise<boolean> {
    await this.client.delete(\`/law-firms/\${id}\`);
    return true;
  }

  // Convenience methods for common operations
  async searchByCity(city: string, page: number = 1): Promise<{
    lawFirms: LawFirm[];
    meta: any;
  }> {
    const result = await this.searchLawFirms({ city, page });
    return {
      lawFirms: result.lawFirms,
      meta: result.meta
    };
  }

  async searchBySpecialization(specializations: string[], page: number = 1): Promise<{
    lawFirms: LawFirm[];
    meta: any;
  }> {
    const result = await this.searchLawFirms({ specializations, page });
    return {
      lawFirms: result.lawFirms,
      meta: result.meta
    };
  }

  async fullTextSearch(query: string, page: number = 1): Promise<{
    lawFirms: LawFirm[];
    meta: any;
  }> {
    const result = await this.searchLawFirms({ q: query, page });
    return {
      lawFirms: result.lawFirms,
      meta: result.meta
    };
  }
}

// Singleton instance
export const lawFirmApiClient = new LawFirmApiClient();
`;

    fs.writeFileSync(path.join(this.outputDir, 'client.ts'), clientContent);
  }

  generateConfig() {
    console.log('⚙️ Generating configuration...');
    
    const configContent = `export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_LAW_FIRM_API_URL || 'https://api.lawfirms.example.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  PER_PAGE_DEFAULT: 20,
  MAX_PER_PAGE: 100
};

export const SPECIALIZATION_CODES = {
  CIVIL: 'Prawo cywilne',
  CRIMINAL: 'Prawo karne',
  FAMILY: 'Prawo rodzinne',
  COMMERCIAL: 'Prawo handlowe',
  LABOR: 'Prawo pracy',
  ADMINISTRATIVE: 'Prawo administracyjne',
  TAX: 'Prawo podatkowe',
  CORPORATE: 'Prawo korporacyjne',
  INTELLECTUAL: 'Prawo własności intelektualnej',
  REAL_ESTATE: 'Prawo nieruchomości'
} as const;

export type SpecializationCode = keyof typeof SPECIALIZATION_CODES;
`;

    fs.writeFileSync(path.join(this.outputDir, 'config.ts'), configContent);
  }

  generateHooks() {
    console.log('🪝 Generating React hooks...');
    
    const hooksContent = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  lawFirmApiClient, 
  LawFirmApiError 
} from '@/lib/law-firm-api/client';
import { 
  LawFirm, 
  LawFirmCreateRequest, 
  LawFirmUpdateRequest, 
  SearchParams 
} from '@/types/law-firm';

const QUERY_KEYS = {
  lawFirms: 'law-firms',
  lawFirmSearch: 'law-firm-search',
  lawFirmDetail: 'law-firm-detail'
} as const;

export function useLawFirmSearch(params: SearchParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.lawFirmSearch, params],
    queryFn: () => lawFirmApiClient.searchLawFirms(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    retry: 3
  });
}

export function useLawFirmDetail(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.lawFirmDetail, id],
    queryFn: () => lawFirmApiClient.getLawFirm(id),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!id
  });
}

export function useCreateLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LawFirmCreateRequest) => 
      lawFirmApiClient.createLawFirm(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.setQueryData([QUERY_KEYS.lawFirmDetail, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Kancelaria została utworzona pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się utworzyć kancelarii',
        variant: 'destructive'
      });
    }
  });
}

export function useUpdateLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LawFirmUpdateRequest }) =>
      lawFirmApiClient.updateLawFirm(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.setQueryData([QUERY_KEYS.lawFirmDetail, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Kancelaria została zaktualizowana pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się zaktualizować kancelarii',
        variant: 'destructive'
      });
    }
  });
}

export function useDeleteLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => lawFirmApiClient.deleteLawFirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.lawFirmDetail, id] });
      toast({
        title: 'Sukces',
        description: 'Kancelaria została usunięta pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się usunąć kancelarii',
        variant: 'destructive'
      });
    }
  });
}

// Convenience hooks for common search patterns
export function useLawFirmsByCity(city: string) {
  return useLawFirmSearch({ city });
}

export function useLawFirmsBySpecialization(specializations: string[]) {
  return useLawFirmSearch({ specializations });
}

export function useLawFirmFullTextSearch(query: string) {
  return useLawFirmSearch({ q: query });
}
`;

    fs.writeFileSync(path.join(this.hooksDir, 'useLawFirm.ts'), hooksContent);
  }

  generateComponents() {
    console.log('🧩 Generating React components...');
    
    // Law Firm Search Component
    const searchComponentContent = `import React, { useState } from 'react';
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
            <LawFirmCard
              key={lawFirm.id}
              lawFirm={lawFirm}
              onSelect={onLawFirmSelect}
            />
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

interface LawFirmCardProps {
  lawFirm: LawFirm;
  onSelect?: (lawFirm: LawFirm) => void;
}

function LawFirmCard({ lawFirm, onSelect }: LawFirmCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect?.(lawFirm)}>
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
            Prawnicy: {lawFirm.lawyers.map(l => \`\${l.first_name} \${l.last_name}\`).join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
`;

    fs.writeFileSync(path.join(this.componentDir, 'LawFirmSearch.tsx'), searchComponentContent);

    // Law Firm Detail Component
    const detailComponentContent = `import React from 'react';
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

          {lawFirm.lawyers.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Prawnicy ({lawFirm.lawyers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lawFirm.lawyers.map((lawyer) => (
                    <div key={lawyer.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">
                        {lawyer.title && \`\${lawyer.title} \`}
                        {lawyer.first_name} {lawyer.last_name}
                      </div>
                      {lawyer.email && (
                        <div className="text-sm text-gray-600">{lawyer.email}</div>
                      )}
                      {lawyer.phone && (
                        <div className="text-sm text-gray-600">{lawyer.phone}</div>
                      )}
                      {lawyer.bar_number && (
                        <div className="text-sm text-gray-500">
                          Nr wpisu: {lawyer.bar_number}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
`;

    fs.writeFileSync(path.join(this.componentDir, 'LawFirmDetail.tsx'), detailComponentContent);
  }
}

// Run the generator
const generator = new LawFirmIntegrationGenerator();
generator.generate().catch(console.error);
