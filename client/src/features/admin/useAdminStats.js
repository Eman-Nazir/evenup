import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.data.stats;
    },
  });
};