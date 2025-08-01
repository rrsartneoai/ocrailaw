
export interface Brand {
  id: string;
  name: string;
  domain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  tagline: string;
  priceMultiplier: number;
}

export const brands: Record<string, Brand> = {
  pismoodkomornika: {
    id: 'pismoodkomornika',
    name: 'Pismo od Komornika',
    domain: 'pismoodkomornika.pl',
    logo: 'Pismo od Komornika',
    primaryColor: '#dc2626', // red-600
    secondaryColor: '#991b1b', // red-800
    description: 'Specjalistyczna pomoc przy pismach od komorników',
    tagline: 'Otrzymałeś pismo od komornika? Pomożemy Ci!',
    priceMultiplier: 0.8
  },
  pismzsadu: {
    id: 'pismzsadu',
    name: 'Pismo z Sądu',
    domain: 'pismzsadu.pl',
    logo: 'Pismo z Sądu',
    primaryColor: '#1d4ed8', // blue-700
    secondaryColor: '#1e3a8a', // blue-800
    description: 'Profesjonalna analiza pism sądowych',
    tagline: 'Pismo z sądu? Nie zostawiaj tego przypadkowi!',
    priceMultiplier: 0.9
  },
  atomai: {
    id: 'atomai',
    name: 'AtomAI',
    domain: 'atomai.pl',
    logo: 'AtomAI',
    primaryColor: '#7c3aed', // violet-600
    secondaryColor: '#5b21b6', // violet-800
    description: 'Prawniczy silnik AI - profesjonalne analizy i pisma',
    tagline: 'AI-powered legal solutions',
    priceMultiplier: 1.2
  },
  kancelaria: {
    id: 'kancelaria',
    name: 'Kancelaria Online',
    domain: 'kancelaria-online.pl',
    logo: 'Kancelaria Online',
    primaryColor: '#059669', // emerald-600
    secondaryColor: '#047857', // emerald-700
    description: 'Internetowa kancelaria prawna nowej generacji',
    tagline: 'Szybka i fachowa pomoc prawna online',
    priceMultiplier: 1.0
  }
};

export const getCurrentBrand = (): Brand => {
  // W rzeczywistej aplikacji sprawdzałbyś domenę
  // Na razie zwracam domyślny brand
  const hostname = window.location.hostname;
  
  for (const brand of Object.values(brands)) {
    if (hostname.includes(brand.id) || hostname === brand.domain) {
      return brand;
    }
  }
  
  // Domyślny brand
  return brands.atomai;
};
