#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateBackendIntegration() {
  console.log('🚀 Generating Backend Integration...');

  // Create necessary directories
  ensureDirectoryExists('src/types');
  ensureDirectoryExists('src/lib/api');
  ensureDirectoryExists('src/hooks');
  ensureDirectoryExists('src/services');

  // Generate TypeScript types
  generateTypes();
  
  // Generate API client
  generateApiClient();
  
  // Generate configuration
  generateConfig();
  
  // Generate React hooks
  generateHooks();
  
  // Generate services
  generateServices();

  console.log('✅ Backend integration generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update src/lib/api/config.ts with your backend URL');
  console.log('2. Configure authentication tokens if needed');
  console.log('3. Import and use the generated hooks in your components');
  console.log('4. Test the integration with your backend');
}

function generateTypes() {
  const typesContent = `// Auto-generated types for Backend API
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  upload_date: string;
  user_id: string;
  order_id?: string;
  s3_key: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_text?: string;
  metadata?: Record<string, any>;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  analysis_type: 'standard' | 'premium' | 'express';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  documents: Document[];
  analysis_results?: AnalysisResult[];
}

export interface AnalysisResult {
  id: string;
  order_id: string;
  document_id: string;
  analysis_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: Record<string, any>;
  confidence_score?: number;
  processing_time?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'card' | 'blik' | 'transfer';
  payment_provider: string;
  provider_payment_id?: string;
  created_at: string;
  completed_at?: string;
  failure_reason?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface CreateOrderRequest {
  analysis_type: 'standard' | 'premium' | 'express';
  document_ids: string[];
  notes?: string;
}

export interface UploadDocumentRequest {
  file: File;
  order_id?: string;
}

export interface CreatePaymentRequest {
  order_id: string;
  payment_method: 'card' | 'blik' | 'transfer';
  return_url?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    pagination?: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
    };
  };
}

export interface ApiError {
  message: string;
  status_code?: number;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface OrderFilters extends PaginationParams {
  status?: string[];
  analysis_type?: string[];
  date_from?: string;
  date_to?: string;
}

export interface DocumentFilters extends PaginationParams {
  processing_status?: string[];
  mime_type?: string[];
  upload_date_from?: string;
  upload_date_to?: string;
}
`;

  fs.writeFileSync('src/types/backend.ts', typesContent);
  console.log('✅ Generated types/backend.ts');
}

function generateConfig() {
  const configContent = `export const API_CONFIG = {
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
`;

  fs.writeFileSync('src/lib/api/config.ts', configContent);
  console.log('✅ Generated lib/api/config.ts');
}

function generateApiClient() {
  const clientContent = `import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  User, 
  Document, 
  Order, 
  AnalysisResult, 
  Payment,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  CreateOrderRequest,
  UploadDocumentRequest,
  CreatePaymentRequest,
  ApiResponse,
  ApiError,
  OrderFilters,
  DocumentFilters
} from '@/types/backend';
import { API_CONFIG } from './config';

export class BackendApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'BackendApiError';
  }
}

export class BackendApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.client = axios.create({
      baseURL: baseURL + '/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: API_CONFIG.TIMEOUT
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = \`Bearer \${newToken}\`;
            return this.client.request(originalRequest);
          } catch (refreshError) {
            this.clearStoredTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        const errorMessage = (error.response?.data as any)?.message || error.message;
        throw new BackendApiError(
          errorMessage,
          error.response?.status,
          error.response?.data
        );
      }
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private storeTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  private clearStoredTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new BackendApiError('No refresh token available');
      }

      const response = await this.client.post<ApiResponse<AuthTokens>>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );

      if (response.data.success && response.data.data) {
        this.storeTokens(response.data.data);
        return response.data.data.access_token;
      }

      throw new BackendApiError('Failed to refresh token');
    })();

    try {
      const token = await this.refreshPromise;
      this.refreshPromise = null;
      return token;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data.success && response.data.data) {
      this.storeTokens(response.data.data.tokens);
      return response.data.data;
    }

    throw new BackendApiError('Login failed');
  }

  async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.client.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );

    if (response.data.success && response.data.data) {
      this.storeTokens(response.data.data.tokens);
      return response.data.data;
    }

    throw new BackendApiError('Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await this.client.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.clearStoredTokens();
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get profile');
  }

  // Document methods
  async uploadDocument(file: File, orderId?: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (orderId) {
      formData.append('order_id', orderId);
    }

    const response = await this.client.post<ApiResponse<Document>>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to upload document');
  }

  async getDocuments(filters: DocumentFilters = {}): Promise<{
    documents: Document[];
    meta: any;
  }> {
    const response = await this.client.get<ApiResponse<Document[]>>(
      API_CONFIG.ENDPOINTS.DOCUMENTS.LIST,
      { params: filters }
    );

    if (response.data.success) {
      return {
        documents: response.data.data || [],
        meta: response.data.meta
      };
    }

    throw new BackendApiError('Failed to get documents');
  }

  async getDocument(documentId: string): Promise<Document> {
    const response = await this.client.get<ApiResponse<Document>>(
      \`\${API_CONFIG.ENDPOINTS.DOCUMENTS.GET}/\${documentId}\`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get document');
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    const response = await this.client.delete<ApiResponse<boolean>>(
      \`\${API_CONFIG.ENDPOINTS.DOCUMENTS.DELETE}/\${documentId}\`
    );

    return response.data.success;
  }

  // Order methods
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.client.post<ApiResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS.CREATE,
      orderData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to create order');
  }

  async getOrders(filters: OrderFilters = {}): Promise<{
    orders: Order[];
    meta: any;
  }> {
    const response = await this.client.get<ApiResponse<Order[]>>(
      API_CONFIG.ENDPOINTS.ORDERS.LIST,
      { params: filters }
    );

    if (response.data.success) {
      return {
        orders: response.data.data || [],
        meta: response.data.meta
      };
    }

    throw new BackendApiError('Failed to get orders');
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await this.client.get<ApiResponse<Order>>(
      \`\${API_CONFIG.ENDPOINTS.ORDERS.GET}/\${orderId}\`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get order');
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const response = await this.client.put<ApiResponse<boolean>>(
      \`\${API_CONFIG.ENDPOINTS.ORDERS.CANCEL}/\${orderId}/cancel\`
    );

    return response.data.success;
  }

  // Analysis methods
  async getAnalyses(orderId?: string): Promise<AnalysisResult[]> {
    const params = orderId ? { order_id: orderId } : {};
    const response = await this.client.get<ApiResponse<AnalysisResult[]>>(
      API_CONFIG.ENDPOINTS.ANALYSES.LIST,
      { params }
    );

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new BackendApiError('Failed to get analyses');
  }

  async getAnalysis(analysisId: string): Promise<AnalysisResult> {
    const response = await this.client.get<ApiResponse<AnalysisResult>>(
      \`\${API_CONFIG.ENDPOINTS.ANALYSES.GET}/\${analysisId}\`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get analysis');
  }

  async startAnalysis(orderId: string): Promise<AnalysisResult[]> {
    const response = await this.client.post<ApiResponse<AnalysisResult[]>>(
      API_CONFIG.ENDPOINTS.ANALYSES.START,
      { order_id: orderId }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to start analysis');
  }

  // Payment methods
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    const response = await this.client.post<ApiResponse<Payment>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.CREATE,
      paymentData
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to create payment');
  }

  async getPayments(orderId?: string): Promise<Payment[]> {
    const params = orderId ? { order_id: orderId } : {};
    const response = await this.client.get<ApiResponse<Payment[]>>(
      API_CONFIG.ENDPOINTS.PAYMENTS.LIST,
      { params }
    );

    if (response.data.success) {
      return response.data.data || [];
    }

    throw new BackendApiError('Failed to get payments');
  }

  async getPayment(paymentId: string): Promise<Payment> {
    const response = await this.client.get<ApiResponse<Payment>>(
      \`\${API_CONFIG.ENDPOINTS.PAYMENTS.GET}/\${paymentId}\`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get payment');
  }
}

// Singleton instance
export const backendApiClient = new BackendApiClient();
`;

  fs.writeFileSync('src/lib/api/client.ts', clientContent);
  console.log('✅ Generated lib/api/client.ts');
}

function generateHooks() {
  const hooksContent = `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  backendApiClient, 
  BackendApiError 
} from '@/lib/api/client';
import { 
  User,
  Document, 
  Order, 
  AnalysisResult,
  Payment,
  LoginRequest,
  RegisterRequest,
  CreateOrderRequest,
  CreatePaymentRequest,
  OrderFilters,
  DocumentFilters
} from '@/types/backend';

const QUERY_KEYS = {
  auth: 'auth',
  profile: 'profile',
  documents: 'documents',
  document: 'document',
  orders: 'orders',
  order: 'order',
  analyses: 'analyses',
  analysis: 'analysis',
  payments: 'payments',
  payment: 'payment'
} as const;

// Auth hooks
export function useLogin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => 
      backendApiClient.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.profile], data.user);
      toast({
        title: 'Sukces',
        description: 'Pomyślnie zalogowano',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd logowania',
        description: error.message || 'Nie udało się zalogować',
        variant: 'destructive'
      });
    }
  });
}

export function useRegister() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => 
      backendApiClient.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.profile], data.user);
      toast({
        title: 'Sukces',
        description: 'Konto zostało utworzone pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd rejestracji',
        description: error.message || 'Nie udało się utworzyć konta',
        variant: 'destructive'
      });
    }
  });
}

export function useLogout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => backendApiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Wylogowano',
        description: 'Zostałeś pomyślnie wylogowany',
        variant: 'default'
      });
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: () => backendApiClient.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });
}

// Document hooks
export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, orderId }: { file: File; orderId?: string }) =>
      backendApiClient.uploadDocument(file, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.documents] });
      toast({
        title: 'Sukces',
        description: 'Dokument został wgrany pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd wgrywania',
        description: error.message || 'Nie udało się wgrać dokumentu',
        variant: 'destructive'
      });
    }
  });
}

export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.documents, filters],
    queryFn: () => backendApiClient.getDocuments(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.document, documentId],
    queryFn: () => backendApiClient.getDocument(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (documentId: string) => 
      backendApiClient.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.documents] });
      toast({
        title: 'Sukces',
        description: 'Dokument został usunięty',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się usunąć dokumentu',
        variant: 'destructive'
      });
    }
  });
}

// Order hooks
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      backendApiClient.createOrder(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orders] });
      queryClient.setQueryData([QUERY_KEYS.order, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Zamówienie zostało utworzone',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się utworzyć zamówienia',
        variant: 'destructive'
      });
    }
  });
}

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.orders, filters],
    queryFn: () => backendApiClient.getOrders(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.order, orderId],
    queryFn: () => backendApiClient.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderId: string) =>
      backendApiClient.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.orders] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order, orderId] });
      toast({
        title: 'Sukces',
        description: 'Zamówienie zostało anulowane',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się anulować zamówienia',
        variant: 'destructive'
      });
    }
  });
}

// Analysis hooks
export function useAnalyses(orderId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.analyses, orderId],
    queryFn: () => backendApiClient.getAnalyses(orderId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useAnalysis(analysisId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.analysis, analysisId],
    queryFn: () => backendApiClient.getAnalysis(analysisId),
    enabled: !!analysisId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function useStartAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (orderId: string) =>
      backendApiClient.startAnalysis(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.analyses] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.order, orderId] });
      toast({
        title: 'Sukces',
        description: 'Analiza została uruchomiona',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się uruchomić analizy',
        variant: 'destructive'
      });
    }
  });
}

// Payment hooks
export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (paymentData: CreatePaymentRequest) =>
      backendApiClient.createPayment(paymentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payments] });
      queryClient.setQueryData([QUERY_KEYS.payment, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Płatność została zainicjowana',
        variant: 'default'
      });
    },
    onError: (error: BackendApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się zainicjować płatności',
        variant: 'destructive'
      });
    }
  });
}

export function usePayments(orderId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.payments, orderId],
    queryFn: () => backendApiClient.getPayments(orderId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.payment, paymentId],
    queryFn: () => backendApiClient.getPayment(paymentId),
    enabled: !!paymentId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000
  });
}
`;

  fs.writeFileSync('src/hooks/useBackend.ts', hooksContent);
  console.log('✅ Generated hooks/useBackend.ts');
}

function generateServices() {
  const servicesContent = `import { backendApiClient } from '@/lib/api/client';
import { Document, Order, AnalysisResult } from '@/types/backend';

export class DocumentService {
  static async uploadMultipleFiles(
    files: File[], 
    orderId?: string,
    onProgress?: (progress: number) => void
  ): Promise<Document[]> {
    const results: Document[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      try {
        const document = await backendApiClient.uploadDocument(files[i], orderId);
        results.push(document);
        
        if (onProgress) {
          onProgress(((i + 1) / total) * 100);
        }
      } catch (error) {
        console.error(\`Failed to upload file \${files[i].name}:\`, error);
        throw error;
      }
    }

    return results;
  }

  static async downloadDocument(documentId: string): Promise<Blob> {
    // Implementation depends on your backend's download endpoint
    const response = await fetch(\`/api/documents/\${documentId}/download\`, {
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('access_token')}\`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download document');
    }

    return response.blob();
  }

  static getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel')) return '📊';
    return '📎';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export class OrderService {
  static calculateOrderTotal(analysisType: string, documentCount: number): number {
    const basePrices = {
      'standard': 29.99,
      'premium': 59.99,
      'express': 99.99
    };

    const basePrice = basePrices[analysisType as keyof typeof basePrices] || 29.99;
    const documentMultiplier = Math.max(1, documentCount);
    
    return basePrice * documentMultiplier;
  }

  static getStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'processing': 'W trakcie',
      'completed': 'Zakończone',
      'cancelled': 'Anulowane'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static async createOrderWithDocuments(
    analysisType: string,
    files: File[]
  ): Promise<{ order: Order; documents: Document[] }> {
    try {
      // First upload documents
      const documents = await DocumentService.uploadMultipleFiles(files);
      
      // Then create order with document IDs
      const order = await backendApiClient.createOrder({
        analysis_type: analysisType as any,
        document_ids: documents.map(doc => doc.id)
      });

      return { order, documents };
    } catch (error) {
      console.error('Failed to create order with documents:', error);
      throw error;
    }
  }
}

export class AnalysisService {
  static getAnalysisStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getAnalysisStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'processing': 'Przetwarzanie',
      'completed': 'Zakończona',
      'failed': 'Błąd'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static formatConfidenceScore(score?: number): string {
    if (!score) return 'N/A';
    return \`\${(score * 100).toFixed(1)}%\`;
  }

  static exportAnalysisResults(analysis: AnalysisResult): void {
    const dataStr = JSON.stringify(analysis.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`analysis-\${analysis.id}.json\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export class PaymentService {
  static getPaymentStatusColor(status: string): string {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-purple-100 text-purple-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  static getPaymentStatusText(status: string): string {
    const texts = {
      'pending': 'Oczekuje',
      'completed': 'Opłacone',
      'failed': 'Błąd',
      'refunded': 'Zwrócone'
    };

    return texts[status as keyof typeof texts] || 'Nieznany';
  }

  static getPaymentMethodText(method: string): string {
    const methods = {
      'card': 'Karta płatnicza',
      'blik': 'BLIK',
      'transfer': 'Przelew'
    };

    return methods[method as keyof typeof methods] || 'Nieznany';
  }

  static formatAmount(amount: number, currency: string = 'PLN'): string {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
`;

  fs.writeFileSync('src/services/backendServices.ts', servicesContent);
  console.log('✅ Generated services/backendServices.ts');
}

// Run the generator
generateBackendIntegration();
