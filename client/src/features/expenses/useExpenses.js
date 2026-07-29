import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useExpenses = (groupId, page = 1) => {
  return useQuery({
    queryKey: ['expenses', groupId, page],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/group/${groupId}?page=${page}&limit=20`);
      return data.data; // { expenses, pagination }
    },
    enabled: !!groupId,
    refetchOnWindowFocus: true,
  });
};