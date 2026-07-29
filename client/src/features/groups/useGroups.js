import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useGroups = (page = 1) => {
  return useQuery({
    queryKey: ['groups', page],
    queryFn: async () => {
      const { data } = await api.get(`/groups?page=${page}&limit=20`);
      return data.data; // { groups, pagination }
    },
  });
};