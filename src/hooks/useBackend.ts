import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
