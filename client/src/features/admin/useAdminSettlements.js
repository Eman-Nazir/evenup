import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useAdminSettlements = (page = 1) => {
  return useQuery({
    queryKey: ['adminSettlements', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/settlements', { params: { page, limit: 15 } });
      return data.data;
    },
  });
};