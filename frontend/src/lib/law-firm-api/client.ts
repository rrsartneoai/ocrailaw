import axios, { AxiosInstance, AxiosError } from 'axios';
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
      baseURL: `${baseURL}/api/v1`,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'LawFirmClient/1.0.0',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` })
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
          if (originalRequest && !(originalRequest as any).metadata?.retryCount) {
            (originalRequest as any).metadata = { retryCount: 1 };
            return this.client.request(originalRequest);
          }
        }
        
        const errorMessage = (error.response?.data as any)?.detail || error.message;
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
    const response = await this.client.get<JSONAPIResponse<any>>(`/law-firms/${id}`);
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
    const response = await this.client.put<JSONAPIResponse<any>>(`/law-firms/${id}`, data);
    return response.data.data.attributes;
  }

  async deleteLawFirm(id: string): Promise<boolean> {
    await this.client.delete(`/law-firms/${id}`);
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