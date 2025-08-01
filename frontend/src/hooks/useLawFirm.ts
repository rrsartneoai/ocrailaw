import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  lawFirmApiClient, 
  LawFirmApiError 
} from '@/lib/law-firm-api/client';
import { 
  LawFirm, 
  LawFirmCreateRequest, 
  LawFirmUpdateRequest, 
  SearchParams 
} from '@/types/law-firm';

const QUERY_KEYS = {
  lawFirms: 'law-firms',
  lawFirmSearch: 'law-firm-search',
  lawFirmDetail: 'law-firm-detail'
} as const;

export function useLawFirmSearch(params: SearchParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.lawFirmSearch, params],
    queryFn: () => lawFirmApiClient.searchLawFirms(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    retry: 3
  });
}

export function useLawFirmDetail(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.lawFirmDetail, id],
    queryFn: () => lawFirmApiClient.getLawFirm(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id
  });
}

export function useCreateLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LawFirmCreateRequest) => 
      lawFirmApiClient.createLawFirm(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.setQueryData([QUERY_KEYS.lawFirmDetail, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Kancelaria została utworzona pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się utworzyć kancelarii',
        variant: 'destructive'
      });
    }
  });
}

export function useUpdateLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LawFirmUpdateRequest }) =>
      lawFirmApiClient.updateLawFirm(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.setQueryData([QUERY_KEYS.lawFirmDetail, data.id], data);
      toast({
        title: 'Sukces',
        description: 'Kancelaria została zaktualizowana pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się zaktualizować kancelarii',
        variant: 'destructive'
      });
    }
  });
}

export function useDeleteLawFirm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => lawFirmApiClient.deleteLawFirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lawFirmSearch] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.lawFirmDetail, id] });
      toast({
        title: 'Sukces',
        description: 'Kancelaria została usunięta pomyślnie',
        variant: 'default'
      });
    },
    onError: (error: LawFirmApiError) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się usunąć kancelarii',
        variant: 'destructive'
      });
    }
  });
}

// Convenience hooks for common search patterns
export function useLawFirmsByCity(city: string) {
  return useLawFirmSearch({ city });
}

export function useLawFirmsBySpecialization(specializations: string[]) {
  return useLawFirmSearch({ specializations });
}

export function useLawFirmFullTextSearch(query: string) {
  return useLawFirmSearch({ q: query });
}