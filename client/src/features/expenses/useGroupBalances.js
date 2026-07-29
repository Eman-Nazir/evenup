import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useGroupBalances = (groupId) => {
  return useQuery({
    queryKey: ['balances', groupId],
    queryFn: async () => {
      const { data } = await api.get(`/groups/${groupId}/balances`);
      return data.data.balances;
    },
    enabled: !!groupId,
  });
};