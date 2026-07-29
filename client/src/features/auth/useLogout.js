import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuthStore } from './useAuthStore';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/logout');
      return data;
    },
    onSuccess: (data) => {
      clearUser();
      showSuccess(data.message);
      navigate('/login');
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};