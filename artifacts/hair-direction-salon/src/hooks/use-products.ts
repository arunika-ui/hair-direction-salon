import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}
