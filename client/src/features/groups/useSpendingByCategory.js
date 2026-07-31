import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useSpendingByCategory = (groupId) => {
  return useQuery({
    queryKey: ['spendingByCategory', groupId],
    queryFn: async () => {
      const { data } = await api.get(`/groups/${groupId}/spending-by-category`);
      return data.data.spending;
    },
    enabled: !!groupId,
    refetchOnWindowFocus: true,
    refetchInterval: 8000, 
  });
};