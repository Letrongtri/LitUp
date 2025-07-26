import adminService from '@/services/admin.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, unref } from 'vue';

export function useStatistics() {
  return useQuery({
    queryKey: ['admin.statistics'],
    queryFn: () => adminService.getStatistics(),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUsersByAdmin(page, limit) {
  return useQuery({
    queryKey: computed(() => ['admin.users', unref(page), unref(limit)]),
    queryFn: () => adminService.getUsersByAdmin(unref(page), unref(limit)),
    keepPreviousData: true,
  });
}

export function useUpdateUserByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }) => adminService.editAccount(uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin.users']);
    },
  });
}
