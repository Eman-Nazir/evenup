import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    },
    onSuccess: (data) => showSuccess(data.message),
    onError: (error) => showError(getErrorMessage(error)),
  });
};