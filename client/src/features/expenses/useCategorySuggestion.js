import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useCategorySuggestion = (description) => {
  return useQuery({
    queryKey: ['categorySuggestion', description],
    queryFn: async () => {
      const { data } = await api.get('/expenses/suggest-category', {
        params: { description },
      });
      return data.data.category;
    },
    enabled: description?.trim().length >= 3,
    staleTime: Infinity, 
  });
};