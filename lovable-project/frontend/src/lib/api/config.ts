export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    },
    DOCUMENTS: {
      UPLOAD: '/documents/upload',
      LIST: '/documents',
      GET: '/documents',
      DELETE: '/documents',
      DOWNLOAD: '/documents'
    },
    ORDERS: {
      CREATE: '/orders',
      LIST: '/orders',
      GET: '/orders',
      UPDATE: '/orders',
      CANCEL: '/orders'
    },
    ANALYSES: {
      LIST: '/analyses',
      GET: '/analyses',
      START: '/analyses/start',
      RESULTS: '/analyses'
    },
    PAYMENTS: {
      CREATE: '/payments',
      LIST: '/payments',
      GET: '/payments',
      CONFIRM: '/payments',
      WEBHOOK: '/payments/webhook'
    }
  }
};

export const ANALYSIS_TYPES = {
  STANDARD: {
    code: 'standard',
    name: 'Analiza standardowa',
    description: 'Podstawowa analiza dokumentu',
    price: 29.99,
    processing_time: '2-4 godziny'
  },
  PREMIUM: {
    code: 'premium', 
    name: 'Analiza premium',
    description: 'Szczegółowa analiza z rekomendacjami',
    price: 59.99,
    processing_time: '1-2 godziny'
  },
  EXPRESS: {
    code: 'express',
    name: 'Analiza ekspresowa',
    description: 'Szybka analiza w 30 minut',
    price: 99.99,
    processing_time: '15-30 minut'
  }
} as const;

export type AnalysisTypeCode = keyof typeof ANALYSIS_TYPES;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_METHODS = {
  CARD: 'card',
  BLIK: 'blik',
  TRANSFER: 'transfer'
} as const;
