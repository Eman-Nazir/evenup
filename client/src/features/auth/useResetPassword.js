import { useMutation } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await api.patch(`/auth/reset-password/${token}`, { password });
      return data;
    },
    onSuccess: (data) => showSuccess(data.message),
    onError: (error) => showError(getErrorMessage(error)),
  });
};