
export interface PricingTier {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: string[];
  deliveryTime: string;
  popular?: boolean;
}

export const analysisTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Analiza Podstawowa',
    basePrice: 49,
    description: 'Podstawowa analiza prawna dokumentu',
    features: [
      'Analiza treści dokumentu',
      'Identyfikacja problemów prawnych',
      'Ogólne zalecenia działania',
      'Dostarczenie w ciągu 48h'
    ],
    deliveryTime: '24-48h'
  },
  {
    id: 'standard',
    name: 'Analiza Standard',
    basePrice: 89,
    description: 'Szczegółowa analiza z konkretnymi rozwiązaniami',
    features: [
      'Szczegółowa analiza prawna',
      'Konkretne kroki do podjęcia',
      'Przewidywane scenariusze',
      'Propozycje konkretnych pism',
      'Dostarczenie w ciągu 24h'
    ],
    deliveryTime: '12-24h',
    popular: true
  },
  {
    id: 'premium',
    name: 'Analiza Premium',
    basePrice: 149,
    description: 'Kompleksowa analiza z konsultacją',
    features: [
      'Pełna analiza prawna',
      'Gotowe wzory pism',
      'Konsultacja telefoniczna 15min',
      'Wsparcie przy składaniu pism',
      'Dostarczenie w ciągu 12h'
    ],
    deliveryTime: '6-12h'
  }
];

export const documentTypes = [
  {
    id: 'bailiff',
    name: 'Pismo od komornika',
    icon: 'FileText',
    basePrice: 59,
    description: 'Analiza pism komorniczych i przygotowanie odpowiedzi'
  },
  {
    id: 'court',
    name: 'Pismo z sądu',
    icon: 'Scale',
    basePrice: 79,
    description: 'Analiza dokumentów sądowych i procesowych'
  },
  {
    id: 'contract',
    name: 'Umowa/Reklamacja',
    icon: 'FileSignature',
    basePrice: 49,
    description: 'Przegląd umów i przygotowanie reklamacji'
  },
  {
    id: 'debt',
    name: 'Wezwanie do zapłaty',
    icon: 'CreditCard',
    basePrice: 39,
    description: 'Analiza wezwań do zapłaty i porad'
  }
];
