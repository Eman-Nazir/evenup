import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post('/friendships/request', { email });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};