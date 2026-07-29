import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useAddExpense = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/expenses', { ...payload, group: groupId });
      return data;
    },
    onSuccess: (data) => {
  queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
  queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
  queryClient.invalidateQueries({ queryKey: ['simplifiedDebts', groupId] });
  queryClient.invalidateQueries({ queryKey: ['activity', groupId] });        
  queryClient.invalidateQueries({ queryKey: ['spendingByCategory', groupId] }); 
  showSuccess(data.message);
},
    onError: (error) => showError(getErrorMessage(error)),
  });
};