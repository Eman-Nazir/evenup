import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useCurrentUser = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.data.user;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess) setUser(query.data);
    if (query.isError) clearUser();
  }, [query.isSuccess, query.isError, query.data, setUser, clearUser]);

  return query;
};