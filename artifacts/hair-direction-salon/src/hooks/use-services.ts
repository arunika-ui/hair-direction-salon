import { useQuery } from '@tanstack/react-query';
import { fetchServiceGroups } from '@/lib/services';

export function useServiceGroups() {
  return useQuery({
    queryKey: ['service-groups'],
    queryFn: fetchServiceGroups,
  });
}
