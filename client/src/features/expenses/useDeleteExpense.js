import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useDeleteExpense = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId) => {
      const { data } = await api.delete(`/expenses/${expenseId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
      queryClient.invalidateQueries({ queryKey: ['simplifiedDebts', groupId] });
      queryClient.invalidateQueries({ queryKey: ['activity', groupId] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};