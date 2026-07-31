import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useUpdateGroup = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/groups/${groupId}`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};