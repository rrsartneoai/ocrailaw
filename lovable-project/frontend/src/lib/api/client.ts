import axios, { AxiosInstance, AxiosError } from 'axios';
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
          config.headers.Authorization = `Bearer ${token}`;
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
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
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
      `${API_CONFIG.ENDPOINTS.DOCUMENTS.GET}/${documentId}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get document');
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    const response = await this.client.delete<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.DOCUMENTS.DELETE}/${documentId}`
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
      `${API_CONFIG.ENDPOINTS.ORDERS.GET}/${orderId}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get order');
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const response = await this.client.put<ApiResponse<boolean>>(
      `${API_CONFIG.ENDPOINTS.ORDERS.CANCEL}/${orderId}/cancel`
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
      `${API_CONFIG.ENDPOINTS.ANALYSES.GET}/${analysisId}`
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
      `${API_CONFIG.ENDPOINTS.PAYMENTS.GET}/${paymentId}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new BackendApiError('Failed to get payment');
  }
}

// Singleton instance
export const backendApiClient = new BackendApiClient();
