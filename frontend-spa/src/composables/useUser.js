import usersService from '@/services/users.service';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

export function useUser() {
  const auth = useAuthStore();

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: usersService.fetchMe,
    enabled: !!auth.token, // chỉ fetch nếu đã có token
  });

  return userQuery;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => usersService.updateUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
    },
  });
}
