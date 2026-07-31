import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendshipId) => {
      const { data } = await api.delete(`/friendships/${friendshipId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};