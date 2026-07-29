import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useGroupActivity = (groupId) => {
  return useQuery({
    queryKey: ['activity', groupId],
    queryFn: async () => {
      const { data } = await api.get(`/groups/${groupId}/activity`);
      return data.data.feed;
    },
    enabled: !!groupId,
    refetchOnWindowFocus: true,
  });
};