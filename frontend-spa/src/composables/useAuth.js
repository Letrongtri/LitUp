import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/auth.service';

export function useUser() {
  const auth = useAuthStore();

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: authService.fetchMe,
    enabled: !!auth.token, // chỉ fetch nếu đã có token
  });

  return userQuery;
}

export function useLogin() {
  const auth = useAuthStore();

  return useMutation({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: () => auth.fetchMe,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
  });
}
