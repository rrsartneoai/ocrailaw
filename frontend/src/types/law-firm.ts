// Auto-generated types from Law Firm API specification
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