import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useUpdateExpense = (groupId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ expenseId, payload }) => {
      const { data } = await api.patch(`/expenses/${expenseId}`, payload);
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