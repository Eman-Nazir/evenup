import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useRespondToRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ friendshipId, action }) => {
      const { data } = await api.patch(`/friendships/request/${friendshipId}`, { action });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};