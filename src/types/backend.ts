// Auto-generated types for Backend API
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
