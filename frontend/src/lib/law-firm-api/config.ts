export const API_CONFIG = {
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