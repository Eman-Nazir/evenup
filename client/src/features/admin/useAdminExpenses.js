import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useAdminExpenses = (page = 1) => {
  return useQuery({
    queryKey: ['adminExpenses', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/expenses', { params: { page, limit: 15 } });
      return data.data;
    },
  });
};