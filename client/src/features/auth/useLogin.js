import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuthStore } from './useAuthStore';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
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