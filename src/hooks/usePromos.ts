import { useQuery } from '@tanstack/react-query'
import { getPromos } from '@/API/PromoAPI'
import type { PromoFilterType } from '@/types/promo'

export function usePromos(filter: PromoFilterType = 'todos') {
  const { data: promos, isLoading, isError } = useQuery({
    queryKey: ['promos', filter],
    queryFn: () => getPromos(filter),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  return { promos: promos ?? [], isLoading, isError }
}
