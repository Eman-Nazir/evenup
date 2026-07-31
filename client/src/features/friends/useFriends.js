import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await api.get('/friendships');
      return data.data.friends;
    },
  });
};