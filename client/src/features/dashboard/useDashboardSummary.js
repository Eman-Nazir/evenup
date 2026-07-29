import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/users/dashboard-summary');
      return data.data.summary;
    },
  });
};