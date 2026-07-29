import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useSettlements = (groupId, page = 1) => {
  return useQuery({
    queryKey: ['settlements', groupId, page],
    queryFn: async () => {
      const { data } = await api.get(`/settlements/group/${groupId}?page=${page}`);
      return data.data;
    },
    enabled: !!groupId,
  });
};