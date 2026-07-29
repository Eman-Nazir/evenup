import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuthStore } from './useAuthStore';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useSignup = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      return data;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      showSuccess(data.message);
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });
};