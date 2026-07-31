import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showSuccess, showError, getErrorMessage } from '../../lib/toast';

export const useAdminGroups = (page = 1) => {
  return useQuery({
    queryKey: ['adminGroups', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/groups', { params: { page, limit: 15 } });
      return data.data;
    },
  });
};

export const useDeleteGroupAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId) => {
      const { data } = await api.delete(`/admin/groups/${groupId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      showSuccess(data.message);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });
};