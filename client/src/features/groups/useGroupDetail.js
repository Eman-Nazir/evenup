import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useGroupDetail = (groupId) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data } = await api.get(`/groups/${groupId}`);
      return data.data.group;
    },
    enabled: !!groupId,
    refetchOnWindowFocus: true,
    
refetchInterval: 8000,
  });
};