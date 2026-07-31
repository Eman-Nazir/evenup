import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const usePendingRequests = () => {
  return useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      const { data } = await api.get('/friendships/pending');
      return data.data.requests;
    },
  });
};