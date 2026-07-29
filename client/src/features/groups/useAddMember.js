import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useAddMember = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post(`/groups/${groupId}/members`, { email });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};