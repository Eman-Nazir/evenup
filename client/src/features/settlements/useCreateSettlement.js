import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useCreateSettlement = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/settlements/group/${groupId}`, payload);
      return data;
    },
    onSuccess: (data) => {
  queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
  queryClient.invalidateQueries({ queryKey: ['simplifiedDebts', groupId] });
  queryClient.invalidateQueries({ queryKey: ['settlements', groupId] });
  queryClient.invalidateQueries({ queryKey: ['activity', groupId] });       
  showSuccess(data.message);
},
    onError: (error) => showError(getErrorMessage(error)),
  });
};