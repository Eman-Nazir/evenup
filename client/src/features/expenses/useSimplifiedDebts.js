import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useSimplifiedDebts = (groupId) => {
  return useQuery({
    queryKey: ['simplifiedDebts', groupId],
    queryFn: async () => {
      const { data } = await api.get(`/groups/${groupId}/simplified-debts`);
      return data.data;
    },
    enabled: !!groupId,
    refetchOnWindowFocus: true, 
  });
};