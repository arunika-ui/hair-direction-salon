import { useQuery } from '@tanstack/react-query';
import { fetchGalleryImages } from '@/lib/gallery';

export function useGalleryImages() {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: fetchGalleryImages,
  });
}
